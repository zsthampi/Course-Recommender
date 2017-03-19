class AddLikesToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :like, :integer
  end
end
