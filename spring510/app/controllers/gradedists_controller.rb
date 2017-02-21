class GradedistsController < ApplicationController
  before_action :set_gradedist, only: [:show, :edit, :update, :destroy]

  # GET /gradedists
  # GET /gradedists.json
  def index
    @gradedists = Gradedist.all
  end

  # GET /gradedists/1
  # GET /gradedists/1.json
  def show
  end

  # GET /gradedists/new
  def new
    @gradedist = Gradedist.new
  end

  # GET /gradedists/1/edit
  def edit
  end

  # POST /gradedists
  # POST /gradedists.json
  def create
    @gradedist = Gradedist.new(gradedist_params)

    respond_to do |format|
      if @gradedist.save
        format.html { redirect_to @gradedist, notice: 'Gradedist was successfully created.' }
        format.json { render :show, status: :created, location: @gradedist }
      else
        format.html { render :new }
        format.json { render json: @gradedist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /gradedists/1
  # PATCH/PUT /gradedists/1.json
  def update
    respond_to do |format|
      if @gradedist.update(gradedist_params)
        format.html { redirect_to @gradedist, notice: 'Gradedist was successfully updated.' }
        format.json { render :show, status: :ok, location: @gradedist }
      else
        format.html { render :edit }
        format.json { render json: @gradedist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gradedists/1
  # DELETE /gradedists/1.json
  def destroy
    @gradedist.destroy
    respond_to do |format|
      format.html { redirect_to gradedists_url, notice: 'Gradedist was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gradedist
      @gradedist = Gradedist.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def gradedist_params
      params.require(:gradedist).permit(:cid, :section, :instructor, :semester, :integer, :as, :bs, :cs, :ds, :fs, :s, :u, :in, :la, :au, :nr, :w, :total)
    end
end
