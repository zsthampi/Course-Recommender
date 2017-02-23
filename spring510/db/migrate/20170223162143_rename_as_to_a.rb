class RenameAsToA < ActiveRecord::Migration[5.0]
  def change
  	rename_column :gradedists, :as, :a
  end
end
