json.extract! post, :id, :user, :content,  :created_at, :updated_at, :cid
json.url post_url(post, format: :json)