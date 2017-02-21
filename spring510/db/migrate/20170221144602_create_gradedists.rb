class CreateGradedists < ActiveRecord::Migration[5.0]
  def change
    create_table :gradedists do |t|
      t.integer :cid
      t.integer :section
      t.string :instructor
      t.string :semester
      t.string :integer
      t.integer :as
      t.integer :bs
      t.integer :cs
      t.integer :ds
      t.integer :fs
      t.integer :s
      t.integer :u
      t.integer :in
      t.integer :la
      t.integer :au
      t.integer :nr
      t.integer :w
      t.integer :total

      t.timestamps
    end
  end
end
