class AddPreToCourses < ActiveRecord::Migration[5.0]
  def change
    add_column :courses, :pre, :string
  end
end
