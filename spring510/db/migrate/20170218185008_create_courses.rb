class CreateCourses < ActiveRecord::Migration[5.0]
  def change
    create_table :courses do |t|
      t.integer :cid
      t.string :name
      t.text :description
      t.string :syllabus

      t.timestamps
    end
  end
end
