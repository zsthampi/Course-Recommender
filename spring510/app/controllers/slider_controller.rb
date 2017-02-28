class SliderController < ApplicationController
	
	def index
  	end


  	def result
  		
  		str = params[:str]
		@output = `node get_data_from_piazza.js '#{str}'`
  		
  		
  	end
  	
end
