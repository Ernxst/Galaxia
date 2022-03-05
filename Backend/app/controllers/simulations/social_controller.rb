class Simulations::SocialController < Simulations::SimulationsController
  skip_before_action :can_edit?, except: []

  def get_likes
    likes = Like.where(simulation_id: params[:id]).to_a
    usernames = []
    likes.each do |like|
      usernames << like.user.username
    end
    render json: usernames,  status: :ok
  end

  def get_comments
    comments = Comment.where(simulation_id: params[:id]).to_a
    render json: comments, status: :ok
  end

  def like
    simulation = Simulation.find(params[:id].to_i)
    user = User.find_by(username: params[:username])
    like = Like.create(user_id: user.id, simulation_id: simulation.id)
   head :no_content
  end

  def comment
    simulation = Simulation.find(params[:id])
    data = params[:data]
    user = User.find_by(username: data[:username])
    comment = Comment.create(comment: data[:comment], user_id: user.id, simulation_id: simulation.id)
    render json: { id: comment.id, created_at: comment.created_at, simulation_id: params[:id]  }, adapter: :json, status: :ok
  end

  def delete_like
    user = User.find_by(username: params[:username])
    like = Like.find_by(simulation_id: params[:id].to_i, user_id: user.id)
    like.destroy!
    head :no_content
  end

  def delete_comment
    comment = Comment.find(params[:comment_id])
    comment.destroy!
    head :no_content
  end
end
  
