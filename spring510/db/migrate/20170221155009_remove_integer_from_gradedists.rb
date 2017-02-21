class RemoveIntegerFromGradedists < ActiveRecord::Migration[5.0]
  def change
    remove_column :gradedists, :integer, :string
  end
end
