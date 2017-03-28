Rails.application.routes.draw do
  resources :posts
  resources :gradedists
  resources :courses
  resources :syllabuses
  #get 'welcome/homepage'
  get 'slider/index'
  root 'welcome#homepage'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'slider/result'
  get 'slider/result'
  post 'courses/addlikes'
end
