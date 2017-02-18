json.extract! course, :id, :cid, :name, :description, :syllabus, :created_at, :updated_at
json.url course_url(course, format: :json)