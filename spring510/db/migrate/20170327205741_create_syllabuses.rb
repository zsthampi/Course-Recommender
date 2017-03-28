class CreateSyllabuses < ActiveRecord::Migration[5.0]
  def change
    create_table :syllabuses do |t|
      t.integer :cid
      t.string :prof
      t.string :link
      t.string :semester

      t.timestamps
    end
  end
end
