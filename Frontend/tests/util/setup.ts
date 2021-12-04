const winAlert = window.alert;

beforeEach(() => {
  window.alert = jest.fn();
});

afterEach(() => {
  window.alert = winAlert;
});
