class AddCidToPost < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :cid, :int
  end
end
