class CommentSerializer < ActiveModel::Serializer
  belongs_to :user 
  belongs_to :simulation

   def attributes(requested_attrs = nil, reload = nil)
    super
    .merge({ 
      id: object.id, 
      username: object.user.username, 
      simulation_id: object.simulation.id,
      comment: object.comment,
      created_at: object.created_at
      })
  end
end
