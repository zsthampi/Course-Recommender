/*Patterns for regex */
lettersOnly = /[a-zA-Z\s-']+/;
subjectFormat = /^[a-zA-Z]{1,4}( - [a-zA-z]+)?/;
sessionFormat = /^\d{1,2}W?1?/;
timeFormat = /^\d{2}:\d{2}$/;
strmFormat = /^\d{4}$/;
classNumber = /^\d{3}[A-Za-z]?$/;

/* Takes one optional parameter to leave a specific popover open.
 * This is used when switching from one pop over to another without closing
 * the previously opened popover
         **/
function closePopovers() {

    if (arguments.length){
        $('.popover ').prev('[id!="' + arguments[0] + '"]').popover('toggle');
    }
    else{
        $('.popover ').prev().popover('toggle');
    }
}

function clearCriteria(){
    var thisStrm  =$('#strm');
    var selectedStrm = thisStrm.val();
    
    //The first form on the page is the branding bar
    document.forms[1].reset();
    
    thisStrm.val(selectedStrm);
    ga('send', 'event', 'link', 'click', 'clear-criteria');
}

function validateSearch(form){
    $params = $(form).serializeArray();
    
    errorCount = 0;
    filterCount = 0;
    
    subjectReqMet = false;  //this will test if the need for a subject hass been met
    
    $('[id $= "err-msg"]').hide();
    jQuery.each($params, function(i, field) {

        if (field.value !== ''){
            filterCount ++;
            switch (field.name){
                case 'course-inequality':
                case 'start-time-inequality':
                case 'end-time-inequality':
                    filterCount --; //This subtracts from the filters that are just inequalities
                    break;
                case 'term':
                    if (strmFormat.exec(field.value) == null || field.value.length != 4){
                        $("#" + field.name + '-err-msg').text('You must pick a valid semester').show();
                        errorCount ++;
                    }
                    break;
                case 'subject':
                    if (subjectFormat.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You have entered an invalid subject').show();
                        errorCount ++;
                    }
                    subjectReqMet = true;
                    break;
                case 'course-number':
                    field.value = field.value.substr(0,3);
                    if (classNumber.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You have entered an invalid class number').show();
                        errorCount ++;
                    }
                    break;
                case 'course-career':
                    if (lettersOnly.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You must pick a valid career').show();
                        errorCount ++;
                    }
                    
                    //subject not required if career is Vet Med or Agriculture Institute
                    if(field.value == 'AGI' || field.value == 'VETM'){
                        subjectReqMet = true;
                    }
                    break;
                case 'open-classes':
                    if (field.value !== '1'){
                        $("#" + field.name + '-err-msg').text('Invalid open-only status').show();
                        errorCount ++;
                    }
                    break;
                case 'start-time':
                    if (timeFormat.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You must select a valid start time').show();
                        errorCount ++;
                    }
                    break;
                case 'end-time':
                if (timeFormat.exec(field.value) == null){
                    $("#" + field.name + '-err-msg').text('You must select a valid end time').show();
                        errorCount ++;
                    }
                    break;
                case 'session':
                    if (sessionFormat.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You must pick a valid session').show();
                        errorCount ++;
                    }
                    
                    //subject not required if it is a 3W or 8W session
                    //if(field.value != '3W' || field.value == '8W1' || field.value == '8W2'){
                    if(field.value != '1'){
                        subjectReqMet = true;
                    }
                    break;
                case 'instructor-name':
                    if (lettersOnly.exec(field.value) == null){
                        $("#" + field.name + '-err-msg').text('You entered an invalid value for an instructor').show();
                        errorCount ++;
                    }
                    break;
                case 'distance-only':
                    if (field.value !== '1' && field.value !== '0'){
                        $("#" + field.name + '-err-msg').text('Invalid location status').show();
                        errorCount ++;
                    }
                    break;
                default:                    
                    break;
            }
        }
    });
        /*
         * Subject is required unless:
            (a) session code in 3W, 8W1, 8W2; OR
            (b) career in AGI, VETM
         */
        if (!subjectReqMet){
            $('#subject-err-msg').text('Subject required for this search').show();
            errorCount ++;
        }
        
        if(filterCount < 2){
            errorCount = 1;           
        }
        return errorCount === 0;
}

function getSemesterInfo(e) {
    e.preventDefault();
    $.ajax({
        url: 'subjects.php',
                data: 'strm=' + this.value,
                dataType: 'json',
                method: 'post'
        }).done(function(data) {
                $browse.html(data['subj_html']);
                        $browse_btn.dropdown();
                        $session_codes.html(data['sess_html']);
                        $('#browse-menu li a').on('click', function(e) {
                e.preventDefault();
                        e.stopPropagation();
                        $('#auto-subject').val($(this).attr('data-value'));
                        $('#subject-wrapper').removeClass('open');
                });
                        $auto_subject.typeahead('destroy');
                        $auto_subject.val('');
                        var subjects = $.parseJSON(data['subj_js']);
                        $auto_subject.typeahead({
                        source: subjects,
                                items: 12,
                                minLength: 2
                });
                
                ga('send', 'event', 'select', 'change', 'strm');
        });
};

function loadSearch(qs){
    
    isValid = true;
    var qString = qs.substr(1); //remove "?"
    
    if(qString.match('term') && qString.match('subject')){
        request = qString.split('&');
        for(idx = 0; idx < request.length; idx++){

            opt = request[idx];
            opt_pair = opt.split('=');

            switch(opt_pair[0]){
                case 'term':
                    if(!strmFormat.exec(opt_pair[1]) || opt_pair[1].length != 4){
                        isValid = false;
                    }
                    break;
                case 'subject':
                    if(!subjectFormat.exec(opt_pair[1]) || opt_pair[1].length > 4){
                        isValid = false;
                    }
                    break;
                case 'course-number':
                    //remove any letters at the end of the string
                    opt_pair[1] = opt_pair[1].substr(0,3);
                    if(!classNumber.exec(opt_pair[1]) || opt_pair[1].length > 4){
                        isValid = false;
                    }

                    qString += "&course-inequality=%3D";

                    break;
                case 'to': 
                    qString += "&table-only=1";
                    break;    
                case '':              
                    break;
                default:  
                    isValid = false;
                    break;
            };


        }
    }
    else{
        isValid =  false;
    }
    
    
    if(isValid){
    
            qString += '&current_strm=' + $('#current_strm').val();
            processCourses(qString);
            if(qString.match('table-only') == null){
                $expand_icon.addClass('glyphicon-search');
                $expand_icon.removeClass('glyphicon-up-bracket');
            }
    }
}

function getCourses(e) {
    e.preventDefault();
    if (validateSearch(this)){
        processCourses($('#class-search').serialize());
    }//if courses validate
}

function processCourses(searchData){
    table_only = searchData.match('table-only');
    
            //Certain things only need to happen if we are on the index page
            if(table_only == null){
                $('#class-search').addClass('condensed');
                $expand_icon.toggleClass('glyphicon-search');
                $expand_icon.toggleClass('glyphicon-up-bracket');
                $filter.html('');
            }
                    $search_results.html($loader);
                $.ajax({
                    url: 'search.php',
                    data: searchData,
                    dataType: 'json',
                    method: 'post',
                }).done(function(data) {
                    
                    if (data.error != undefined) {
                        validateSearch(data.json.inputs);
                        $search_results.html(data.error);
                        
                        if(table_only == -1)
                            $('#expand-form').click();
                    }
                    else if (data.html !== '') {
                        $search_results.html(data.html);
                        
                            $('[data-toggle="popover"]').popover({
                                //placement: 'top',
                                html: true
                            }).on('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                closePopovers(this.id);
                                $('.popover-close').on('click', closePopovers);
                            });
                    }
                    else {
                        $search_results.html($no_results);
                    }
                    
                    /*Add case keyword*/
                    if(table_only == null){
                        var filter_txt = '<span class="text-bold">Filtered by:</span>';
                        $.each(data.json.inputs, function(key, value) {
                            if (value != '') {
                                switch (key) {
                                    case 'term':
                                        var semester;
                                        switch (value[3]) {
                                            case '1':
                                                semester = 'Spring';
                                                break;
                                            case '8':
                                                semester = 'Fall';
                                                break;
                                            case '6':
                                                semester = 'Summer 1';
                                                break;
                                            case '7':
                                                semester = 'Summer 2';
                                                break;
                                            default:
                                                break;
                                        }

                                        filter_txt += ' <span class="label label-primary">Semester :: ' + semester + ' ' + value.substr(1, 2) + '</span>';
                                        break;
                                    case 'course-number':
                                        filter_txt += ' <span class="label label-primary">Course # :: ' + data.json.inputs['course-inequality'] + value + '</span>';
                                        break;
                                    case 'start-time':
                                        filter_txt += ' <span class="label label-primary">Starts :: ' + data.json.inputs['start-time-inequality'] + value + '</span>';
                                        break;
                                    case 'end-time':
                                        filter_txt += ' <span class="label label-primary">Ends :: ' + data.json.inputs['end-time-inequality'] + value + '</span>';
                                        break;
                                    case 'instructor-name':
                                        filter_txt += ' <span class="label label-primary">Instructor :: ' + value + '</span>';
                                        break;
                                    case 'subject':
                                        filter_txt += ' <span class="label label-primary">Subject :: ' + value + '</span>';
                                        break;
                                    case 'course-career':
                                        filter_txt += ' <span class="label label-primary">Career :: ' + value + '</span>';
                                        break;
                                    case 'open-classes':
                                        filter_txt += ' <span class="label label-primary">Open Classes:: True</span>';
                                        break;
                                    case 'distance-only':
                                        switch (value) {
                                            case '1':
                                                filter_txt += ' <span class="label label-primary">Distance Only:: True</span>';
                                                break;
                                            case '0':
                                                filter_txt += ' <span class="label label-primary">On-Campus Only:: True</span>';
                                                break;
                                            default:
                                                break;
                                        }

                                        break;
                                    case 'session':
                                        filter_txt += ' <span class="label label-primary">Session:: ' + value + '</span>';
                                        break;
                                    
                                    default:
                                        break;
                                    }
                                }
                            });
                        $filter.html(filter_txt);
                }
                    ga('send', 'pageview','search.php');
                });
    
}


/****************************Begin Directory functions **********************/
var courses;

function getAllSubjects() {
    $.ajax({
        url: 'subjects.php',
        data: 'strm=all',
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
        $browse.html(data['subj_html']);
        $browse_btn.dropdown();

        $('#browse-menu li a').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('#auto-subject').val($(this).attr('data-value'));
            $('#subject-wrapper').removeClass('open');
        });
        $auto_subject.typeahead('destroy');
        
        //If there is a subject sent in, we don't want to over write it
        if(location.search == ''){
            $auto_subject.val('');
        }
        var subjects = $.parseJSON(data['subj_js']);
        $auto_subject.typeahead({
            source: subjects,
            items: 12,
            minLength: 2,
            select: function(){ 
                
                var val = this.$menu.find('.active').data('value');
                if(this.autoSelect || val) {
                  this.$element
                    .val(this.updater(val))
                    .change();
                }
                
                //getCatalogEntries(e);
                return this.hide();
            }
        });
        
        //Load GEP drop down
        $gep.html(data['gep']);
        
        //check for any pre-loaded searches
        if(location.search != ''){
            loadCatalogSearch(location.search);                    
        }

    });

}

function getCatalogEntries(e){
        e.preventDefault();
        $('.error').text('');
        $form = $(this);
        search_val = $form.find('*[name=search_val]').val();
        
        if(search_val.trim() != ''){
     
        queryString = $form.serialize() + '&career=' + $course_career.val();
        processCatalogEntries(queryString);
        }
        else{
            $form.find('.error').html('Please enter a value before searching');
        }
}

function processCatalogEntries(searchData){
     
    $('#class-search').addClass('condensed');
                
                $course_search_results.html($loader);
                $.ajax({
                    url: 'directory_search.php',
                    data: searchData,
                    dataType: 'json',
                    method: 'post'
                }).done(function(data) {
                    
                    if (data.error != undefined) {
                        
                        $course_search_results.html(data.error);
                        
                    }
                    else if (data.html !== '') {
                        $course_search_results.html(data.html);
                        courses = data.courses;
                                                 
                            $('.course-link').on('click', buildCourseLink);
                    }
                    else {
                        $course_search_results.html($no_results);
                    } 
                    
                    var filter_txt = '<span class="text-bold">Search Critereon:</span> ';
                    
                            if( data.json.inputs['career'] !== ''){
                                    filter_txt += ' <span class="label label-primary">Career :: ' + data.json.inputs['career'] + '</span>';
                            
                            }
                    
                            switch (data.json.inputs['type']) {
                                case 'subject':
                                    
                                    filter_txt += ' <span class="label label-primary">Subject :: ' + data.json.inputs['search_val'] + '</span>';
                                                                        
                                    break;
                                case 'keyword':
                                    filter_txt += ' <span class="label label-primary">Keyword(s) :: ' + data.json.inputs['search_val'] + '</span>';
                                    break;
                                case 'gep':
                                    filter_txt += ' <span class="label label-primary">GEP :: ' + data.json.inputs['search_val'] + '</span>';
                                    break;                                
                                                           
                                default:
                                    break;
                            }
                        
                   
                    $filter.html(filter_txt);
                    location.hash = "#course-search-results";
                    
                    if(data.json.inputs['type'] == 'subject' && typeof data.json.inputs['course-number'] != 'undefined'){
                        
                        $('a[data-value='+ data.json.inputs['search_val'] +'-'+ data.json.inputs['course-number']+']').click();
                    }
                    
                    ga('send', 'pageview','directory_search.php');
                });
                }  


function showCourseDetails(course){
    
    //Step 0: Clear out old information
    $('.modal-info').html(' ');
    //Step 1:  Get more details about course (attributes and next semester details
    
    course_id = course.course_id;
    //Step 2:  Populate the Modal HTML
    $course_title.text(course.subject + " " + course.catalog_number + ": " + course.course_title);
    $course_descr.text(course.descr);
    $course_reqs.text(course.reqs);
    
    course_link='';    
    if(course.dept_link != ''){
        course_link = '<a href="' + course.dept_link + '" target="_blank">View department website</a>';      
    }
   
    $course_link.html(course_link);
    
    
    if(course.units_min == course.units_max){
        units = course.units_max;
    }
    else{
        units = course.units_min + ' - ' + course.units_max;
    }
    $course_units.text(units);
   
   
    course_attr = '';
    if(course.attrs.length > 0){
        
        for(a=0; a < course.attrs.length; a++){
            course_attr += '<p><em>' + course.attrs[a] + '</em>';
        }
    }
   $course_attr.html(course_attr);
   
    other_courses = '';
    // Test if this is an empty array instead of an object
    // using typeof with just the field, which when empty is an array
    // still produces true because an array is an object
    if(typeof course.cross_crse.length === 'undefined'){
        other_courses += '<p>Also listed as: ';
        for(c in course.cross_crse){
            other_courses +=  course.cross_crse[c].subject +course.cross_crse[c].catalog_nbr;
        }
    }
   $cross_course.html(other_courses);
   
    course_sem = '';
    query_str = '?subject=' + course.subject + '&course-number=' + course.catalog_number
    if(course.semesters.length > 0){
        
        for(s=0; s < course.semesters.length; s++){
            sem = course.semesters[s].split('|');
            course_sem += '<a href="index.php'+ query_str +'&term=' +sem[0] + '&to=1" target="_blank" class="sem-link">' + sem[1] + '</a> ';
        }
    }
    
    if(course_sem === ''){
        course_sem = 'No future course meetings are currently scheduled';
    }
   $course_sem.html(course_sem);
   
   
   $('.sem-link').on('click', function(e){

        e.preventDefault();
        
        link = this.href.split('?');
        loadSearch('?' + link[1]);
        
         //Mark this link as the one that has been selected
        $('.sem-link').removeClass('label  label-danger');
        $(this).addClass('label label-danger');
   });
    //Step 3:  Reveal Modal Box
    $details_modal.modal('show');
    
}

function loadCatalogSearch(qs){
    
    isValid = true;
    qString = qs.substr(1); //remove "?"
    search = null;
    type = null;
    career = '';
    course_num = '';
   
    
    
    request = qString.split('&');

    for(idx = 0; idx <  request.length; idx++){

        opt = request[idx];
        opt_pair = opt.split('=');

        switch(opt_pair[0]){
            
            case 'subject':
                if(!subjectFormat.exec(opt_pair[1]) || opt_pair[1].length > 4){
                    isValid = false;
                }
                search = opt_pair[1];
                type = 'subject';
                $auto_subject.val(search);
                
                break;
            case 'gep':
                if(!lettersOnly.exec(opt_pair[1]) ){
                    isValid = false;
                }
                search = opt_pair[1];
                type = 'gep';
                $gep.children('option[value=' + search + ']').attr('selected','selected');
                
                break;    
            case 'career':
                if (lettersOnly.exec(opt_pair[1]) == null){
                       isValid = false;
                }
                career = opt_pair[1];
                $('option[value=' + career + ']').attr('selected','selected');
                break;
            case 'course-number':  
                course_num = opt_pair[1];
                    if(!classNumber.exec(opt_pair[1]) || opt_pair[1].length > 4){
                        isValid = false;
                    }
                break;
            case '':              
                break;
            default:  
                isValid = false;
                break;
        };
    }
    
    if(isValid && type !== null){
        query = 'search_val=' + search + '&type='+ type + '&career=' + career + '&course-number=' + course_num;
        processCatalogEntries(query);
    }
}

function buildCourseLink(e) {
    e.preventDefault();
    e.stopPropagation();
    $this = $(this);
    cat_nbr = $this.data('value');
    course = courses[cat_nbr];

    showCourseDetails(course);

}
/****************************Begin degree functions **********************/
function getAllDegrees() {
    $.ajax({
        url: 'degrees.php',
        data: '',
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $degrees.html(data['degree_html']);
            $(".requirement-link").on('click', getDegreeDetails);
            
            if(location.search != ''){
                    loadDegreeDetails(location.search);                    
                } 
        });

}

function getDegreeDetails(e){
        e.preventDefault();
        $('.error').text('');
        $this = $(this);
            
        queryString = 'plan=' + $this.data('plan') + '&subplan=' + $this.data('subplan') + '&career=' + $this.data('career') + '&strm=' + $this.data('strm') + '&program=' + $this.data('program');
        processDegreeDetails(queryString);
        
}

function loadDegreeDetails(qs){
    
    isValid = true;
    qString = qs.substr(1); //remove "?"
    strm = null;
    career = null;
    plan = null;
    subplan = null;
    program = null;
    isArchive = 'FALSE';
    
    request = qString.split('&');

    for(idx = 0; idx <  request.length; idx++){

        opt = request[idx];
        opt_pair = opt.split('=');

        switch(opt_pair[0]){
            
            case 'plan':
                //TODO:  Create plan pattern
                plan = opt_pair[1];
                break;
            case 'subplan':
                //TODO:  Create plan pattern
                subplan = opt_pair[1];
                break;    
            case 'career':
                if (lettersOnly.exec(opt_pair[1]) == null){
                       isValid = false;
                }
                career = opt_pair[1];
                break;
            case 'strm':              
                if (strmFormat.exec(opt_pair[1]) == null){
                       isValid = false;
                }
                strm = opt_pair[1];
                break;
            case 'program':              
                program = opt_pair[1];
                break;
            case '':
                break;
            case 'arch':  
                isArchive = (opt_pair[1] == 'y')?'TRUE':'FALSE';
                break;
            default:  
                isValid = false;
                break;
        };
    }
    
    //Everything must have a value or we will no process
    if(plan === null || subplan === null || career === null || strm === null || program === null){
        isValid = false;
    }
    
    if(isValid){
        $('#program'+program).click();
        queryString = 'plan=' + plan + '&subplan=' + subplan + '&career=' + career + '&strm=' + strm + '&program=' + program + '&isArchive=' + isArchive;
        processDegreeDetails(queryString);
    }
}

function processDegreeDetails(searchData) {
    
    
    $degree_results.html($loader);
    
    params = {};
    p = searchData.split('&');
    
     for(idx = 0; idx <  p.length; idx++){

        opt = p[idx];
        opt_pair = opt.split('=');
        
        params[opt_pair[0]] = opt_pair[1]; 
    }
    
   
    $.ajax({
        url: 'degree_details.php',
        data: searchData ,
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
        $degree_results.html(data['details_html']);
        
         $('.course-link').on('click', buildCourseLink);
         $('.multi-req-link').on('click', getRequirementDetails);
         
         t_plan = $('#'+params.plan + params.subplan);
         plan_title =  t_plan.data('plantitle');
         
         if(params.isArchive == 'TRUE'){
            plan_effdt_raw =  params.strm;
         } else{
            plan_effdt_raw =  String(t_plan.data('strm'));
        }
         
         plan_effdt = '';
         //This isn't the best way to do this, but we needed to parse the data in into 
         // a human readable string
         switch (plan_effdt_raw.substr(3,1)) {
            case '1':
                plan_effdt += 'Spring';
                break;
            case '8':
                plan_effdt +=  'Fall';
                break;
            case '6':
                plan_effdt +=  'Summer 1';
                break;
            case '7':
                plan_effdt += 'Summer 2';
                break;
            default:
                break;
        }
         
         switch (plan_effdt_raw.substr(0,1)) {
            case '1':
                plan_effdt += ' 19';
                break;
            case '2':
                plan_effdt +=  ' 20';
                break;            
            default:
                break;
        }
        
        plan_effdt += plan_effdt_raw.substr(1,2);
         
         if( typeof plan_title == 'undefined'){
             plan_title = params.plan + ' - ' + params.subplan;
         }
         else{
             //if we have a plan title set, we want to add on the subplan for degree type information to be displayed
             plan_title += '('+ t_plan.data('degree') + ')'
         }
                 
         plan_href = ('http://oucc.dasa.ncsu.edu/semester-plans/'+ params.program +'-'+ params.plan +'-'+ params.subplan +'-'+ params.strm +'').toLowerCase();
         plan_html = '<p>' + plan_title + ': ' + data['total_hours'] + ' Total Units';
         plan_html += '<p> Plan effective as of: ' + plan_effdt;
         
          if(params.isArchive == 'TRUE'){
               plan_html += '<p class="alert alert-info">You are currently viewing an archived degree requirements.';
         } else{
            plan_html += '<p><a href="'+ plan_href +'" target="_blank" title="View Semester By Semester Plan">View Semester by Semester Plan</a>';
         }
         $plan_name_head.html(plan_html);
         
         $('.sub-list-collapse').on('click', function(e){
             e.preventDefault();
             $('.sub-list').slideUp();
             $('.selected-multi-req').removeClass('selected-multi-req');
             $('.sub-list-collapse').hide();
             
         });
         
         
          $('[data-toggle="popover"]').popover({
               // placement: 'top',
                html: true
            }).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closePopovers(this.id);
                $('.popover-close').on('click', closePopovers);
            });
         //need to grab and populate the courses variable as well
         courses = data.courses;
         
         location.hash = '#requirement-courses-list';
        });

}

function getRequirementDetails(e) {
    
    e.preventDefault();
    $this = $(this);  
    
        $('.sub-list, .sub-list-collapse').hide();
    $('.selected-multi-req').removeClass('selected-multi-req');
    $this.parent().addClass('selected-multi-req').next('div').html($loader_small).show();
   
    $.ajax({
        url: 'requirement_details.php',
        data: 'requirement=' + $this.data('requirement') + '&effdt=' + $this.data('effdt'),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
        
        
        $this.parent().next('div').html(data['requirement_html']);
        $this.siblings('.sub-list-collapse').show();
        
        if(typeof data.courses != 'undefined'){
            $.each(data.courses, function(key, value) {
                $('.req-course-link').on('click', buildCourseLink);
                courses[key] = value;
            });
            //need to add to course details
        }
         
        });

}

/****************************Begin Transfers functions **********************/
function getTransferDepartments() {
    $coursesGrp.hide();
    $instGrp.hide();
    $equivGrp.hide();
    $loader.show();
    $.ajax({
        url: 'transfer_depts.php',
        data: '',
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $loader.hide();
            $ncsuDept.html(data['dept_html']);
            
        });

}


function getTransferCourses(){
    
    $instGrp.hide();
    $equivGrp.hide();
    if(this.value == ''){
        return;
    }
    $loader.show();
     $.ajax({
        url: 'transfer_depts_courses.php',
        data: 'subject=' + $(this).val(),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $ncsuCourses.html(data['course_html']);
            $ncsuCourseCnt.html(data['course_count']);
            $loader.hide();
            $coursesGrp.show();
    });
}

function getInstiutionsWithCourses(){
    $equivGrp.hide();
    if(this.value == ''){
        return;
    }
    $loader.show();
     $.ajax({
        url: 'transfer_instiutions.php',
        data: 'course_num=' + $(this).val() + '&subject=' + $ncsuDept.val(),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $availInst.html(data['inst_html']);
            $instCnt.html(data['inst_count']);
            $loader.hide();
            $instGrp.show();
    });
}

function getEquivicalCourses(){
    
    if(this.value == ''){
        return;
    }
    $loader.show();
     $.ajax({
        url: 'transfer_equivalencies.php',
        data: 'inst=' + $(this).val() + '&course_num=' + $ncsuCourses.val() + '&subject=' + $ncsuDept.val(),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
        
            var inst = $('#availInstitutions option:selected').text();
            
            $equivTblBody.html(data['inst_html']);             

            $fromSearchRes.html(inst + ': ' + $ncsuDept.val() + ' ' + $ncsuCourses.val());
            $loader.hide();
            $equivGrp.show();
    });
}

function getTransferLocations() {
    
    $loader.show();
    $.ajax({
        url: 'transfer_locations.php',
        data: '',
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $loader.hide();
            $locStates.html(data['state_html']);
            $locCountries.html(data['country_html']);
            
        });

}

function getExtInstiutions(){
    $extDeptGrp.hide();
    $extInstGrp.hide();
    $extEquivGrp.hide();
    if(this.value == ''){
        return;
    }
    $loader.show();
    $this = $(this);
    
    //Setting defaults
   var state = 'XX';
    var country = 'USA';
    
    if(this.id == 'locStates'){
        state = $this.val();
    }
    
    if(this.id == 'locCountries'){
        country = $this.val();
    }
    
    
     $.ajax({
        url: 'ext_transfer_instiutions.php',
        data: 'state=' + state + '&country=' + country,
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $extInst.html(data['inst_html']);
            $extInstCnt.html(data['inst_count']);
            $loader.hide();
            $extInstGrp.show();
    });
}

function getExtInstDepts(){
     $extEquivGrp.hide();
     $loader.show();
     $.ajax({
        url: 'ext_transfer_inst_dept.php',
        data: 'inst_code=' + $(this).val(),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
            $extDept.html(data['dept_html']);
            $extDeptCnt.html(data['dept_count']);
            $loader.hide();
            $extDeptGrp.show();
    });
}

function getExtInstCourses(){
    $loader.show();    
     $.ajax({
        url: 'ext_transfer_inst_courses.php',
        data: 'inst=' + $extInst.val() + '&dept=' + $(this).val(),
        dataType: 'json',
        method: 'post'
    }).done(function(data) {
           $extEquivTblBody.html(data['course_html']);
            
            $loader.hide();
            $extEquivGrp.show();
    });
}