Rails.application.routes.draw do
  resources :gradedists
  resources :courses
  #get 'welcome/homepage'
  get 'slider/index'
  root 'welcome#homepage'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'slider/result'
  get 'slider/result'
end
