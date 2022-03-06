<template>
  <Group ref="group">
    <PointLight v-if="type !== 'star'"
                :cast-shadow="true"
                :decay="2"
                :distance="0"
                :intensity="intensity"
                :position="lightPos"
                color="#ffffff" />
    <star ref="body"
          v-bind="bodyAttributes"
          :receive-shadow="type !== 'star'"
          @star-loaded="assetsLoaded++" />
    <asteroid-belt ref="belt"
                   v-bind="beltAttributes"
                   :max-size="maxAsteroidSize"
                   :min-size="minAsteroidSize"
                   :star-radius="0" />
  </Group>
</template>

<script lang="ts">
import { computeCentreAndSize } from "@/assets/three";
import { BLOOM_LAYER } from "@/assets/three/three.constants";
import { objectWithoutKeys } from "@/assets/util/app.util";
import { MOON_RADIUS, SOLAR_LUMINOSITY, SOLAR_RADIUS, SUN_EARTH_RADIUS_RATIO } from "@/assets/util/celestial.constants";
import { BUMP_SCALE, DISTANCE_SCALE, LIGHTING_SCALE } from "@/assets/util/sim.constants";
import AsteroidBelt from "@/components/three/celestial/containers/asteroid-belt.vue";
import Moon from "@/components/three/celestial/moon.vue";
import Planet from "@/components/three/celestial/planet.vue";
import Star from "@/components/three/celestial/star.vue";
import { CelestialBodyData, CelestialType } from "@/views/create/util/types";
import { defaultAsteroidBelt, defaultStar, scaleParams } from "@/views/create/util/util";
import { Object3D } from "three/src/core/Object3D";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial";
import { Color } from "three/src/math/Color";
import { Vector3 } from "three/src/math/Vector3";
import { Mesh } from "three/src/objects/Mesh";
import { Group, PointLight } from "troisjs";
import { computed, defineComponent, onMounted, PropType, ref, toRefs, watch } from "vue";


export default defineComponent({
  name: "preview-scene",
  emits: ["dataLoaded", "focus", "loaded"],
  components: { Planet, AsteroidBelt, Moon, PointLight, Star, Group },
  props: {
    type: String as PropType<CelestialType>,
    data: Object as PropType<CelestialBodyData>,
  },
  setup(props, { emit }) {
    const assetsToLoad = ref<number>(1);
    const assetsLoaded = ref<number>(0);
    watch(assetsLoaded, () => {
      update();
      let camPos: Vector3;
      if (isAsteroid.value) {
        camPos = new Vector3(2500, 2500, 2500);
      } else {
        const { size } = computeCentreAndSize(body.value.mesh());
        const z = size.length();
        camPos = new Vector3(z, z, z * 9.5);
      }
      emit("loaded", { camPos, models: [] });
    });

    function animate(speed: number) {
      body.value?.spinOnAxis(speed);
      belt.value?.spinOnAxis(speed);
    }

    onMounted(() => (emit("dataLoaded", assetsToLoad.value)));

    const group = ref<typeof Group>(null);
    const body = ref(null);
    const belt = ref(null);
    const { data, type } = toRefs(props);

    const isAsteroid = computed(() => type.value === 'asteroid belt');

    const bodyProps = computed(() => {
      let keys = ['parentId'];
      if (isAsteroid.value) keys = keys.concat("radius", "luminosity", "texture", "atmosphereTexture",
        "bumpMap", "specularMap", "semiMajor", "semiMinor", "eccentricity", "orbitalPeriod");
      const object = objectWithoutKeys(data.value, ...keys);
      const scaled = scaleParams<typeof props.data>(object, type.value);
      // Little hack because this component does not have access to the scene
      // camera to reposition the camera so smaller objects are visible
      switch (type.value) {
        case "planet":
          scaled.radius *= SUN_EARTH_RADIUS_RATIO;
          break;
        case "moon":
          scaled.radius *= SOLAR_RADIUS / MOON_RADIUS;
          break;
        case "asteroid belt":
          scaled.innerSemiMajor *= 5;
          scaled.outerSemiMajor *= 5;
          break;
      }
      return scaled;
    });

    const bodyAttributes = computed(() =>
      isAsteroid.value ? { ...defaultStar } : bodyProps.value);
    const beltAttributes = computed(() => (isAsteroid.value ? bodyProps.value : defaultAsteroidBelt));

    // Use a star component and disable the bloom effect if we're not actually previewing a star
    // Using different components has issues, so just use the same one
    function update() {
      const sphere: Mesh = body.value.mesh();
      const asteroid: Mesh = belt.value.mesh();
      sphere.visible = !isAsteroid.value;
      asteroid.visible = isAsteroid.value;
      let group: Mesh, mesh: Mesh;

      if (isAsteroid.value) {
        group = mesh = asteroid;
      } else {
        group = sphere;
        mesh = sphere.children[0];
      }

      const oldMat = mesh.material;
      if (type.value !== 'star') {
        group.layers.disable(BLOOM_LAYER);
        group.traverse((object: Object3D) => {
          object.layers.disable(BLOOM_LAYER);
        });
        mesh.material = new MeshPhongMaterial({ transparent: true, bumpScale: BUMP_SCALE, shininess: 0 });
      } else {
        group.layers.enable(BLOOM_LAYER);
        group.traverse((object: Object3D) => {
          object.layers.enable(BLOOM_LAYER);
        });
        mesh.material = new MeshBasicMaterial();
        mesh.material.color = new Color(0xdcdcdc);
      }

      if (oldMat) {
        mesh.material.name = oldMat.name;
        mesh.material.map = oldMat.map;
        mesh.material.bumpMap = oldMat.bumpMap;
        mesh.material.specularMap = oldMat.specularMap;
      }

      mesh.material.needsUpdate = true;
    }

    watch(bodyProps, () => update(), { deep: true });

    const scaler = type.value === 'moon' ? 1 : 1e3;
    const intensity = SOLAR_LUMINOSITY * LIGHTING_SCALE * scaler;
    const lightDist = DISTANCE_SCALE * SUN_EARTH_RADIUS_RATIO;
    const lightPos = isAsteroid.value ? { x: 0, y: 0, z: 0 } : { x: -lightDist, y: 0, z: lightDist };
    const minAsteroidSize = 60 * SUN_EARTH_RADIUS_RATIO;
    const maxAsteroidSize = 3000;

    return {
      group, body, belt, assetsLoaded, bodyAttributes, beltAttributes,
      intensity, lightPos, minAsteroidSize, maxAsteroidSize, animate
    };
  }
});
</script>

<style scoped></style>
