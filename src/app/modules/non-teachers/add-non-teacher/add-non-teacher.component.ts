import { NonTeacherService } from './../non-teacher.service';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, forkJoin, map, of } from 'rxjs';
import { DataService } from 'src/app/core/service/data/data.service';
import { dateRangeValidator, minAndMaxDateValidator } from 'src/app/utils/validators/date-range-validator';
interface SubmitBtnStatus {
  personal: boolean;
  education: boolean;
  professional: boolean;
  documents: boolean;
}

interface SubmitBtnStatus {
  personal: boolean, education: boolean, professional: boolean
}
@Component({
  selector: 'app-add-non-teacher',
  templateUrl: './add-non-teacher.component.html',
  styleUrls: ['./add-non-teacher.component.scss']
})
export class AddNonTeacherComponent {
  isSidebarClosed = false;
  currentStep = 1;
  steps = ['Personal Details', 'Educational Details', 'Professional Details', 'Upload Documents', 'Preview & Submit'];
  teacherRegister: boolean = true;
  personalDetailsForm!: FormGroup;
  educationForm!: FormGroup;
  professionalForm!: FormGroup;
  detailViewForm!: FormGroup;
  documentForm!: FormGroup;
  subjects!: any[];
  statuses!: any[];
  schools!: any[];
  religions!: any[];
  maritalStatuses!: any[];
  genders!: any[];
  employeeTypes!: any[];
  employeeCategories!: any[];
  districts!: any[];
  educations!: any[];
  allEducationTypes!: any[];
  coursesByEducation!: any[];
  cities!: any[];
  casteCategories!: any[];
  bloodGroups!: any[];
  approvalTypes!: any[];
  educationTypeId!: number;
  AllDepartment!: any[];
  fullFormData: any
  designationsList!: any[];
  schoolNameWithCity!: any[];
  isEdited: boolean = false;
  employee: any;
  employeeId: any
  files: { [index: number]: File } = {};
  previewUrl: { [index: number]: File } = {};

  submitBtnStatus: SubmitBtnStatus = { personal: false, education: false, professional: false, documents: false }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private nonTeacherService: NonTeacherService, private toastr: ToastrService
  ) {
    this.personalDetailsForm = this.fb.group({
      permanentEmployeeNumber: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]*')]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')]],
      sex: ['', Validators.required],
      dob: ['',[minAndMaxDateValidator('1900-01-01',true,true),Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/)]],
      religion: ['', Validators.required],
      category: ['', Validators.required],
      caste: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      bloodGroup: ['', Validators.required],
      whetherDifferentlyAbled: ['', Validators.required],
      exServicemen: ['', Validators.required],
      identificationMarksOne: ['', Validators.maxLength(100)],
      identificationMarksTwo: ['', Validators.maxLength(100)],
      height: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      aadharId: ['', [Validators.required, Validators.pattern('[0-9]{12}')]],
      pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      // rationCardNumber: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      voterId: ['', [Validators.required, Validators.pattern('[A-Z]{3}[0-9]{7}')]],
      currentAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      permanentAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      fathersName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')]],
      mothersName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),Validators.pattern('^[a-zA-Z ]*$')]],
      interReligion: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      spousesName: ['',],
      spousesReligion: ['',],
      spousesCaste: ['',[ Validators.pattern('^[a-zA-Z ]*$')]],
      photoId: ['']
    },
    );
    // this.educationForm = this.fb.group({
    //   educations: this.fb.array([])
    // });
    this.professionalForm = this.fb.group({
      department: ['', [Validators.required, Validators.maxLength(50)]],
      district: ['', [Validators.required, Validators.maxLength(50)]],
      serviceCategory: [''],
      // employeeType: ['', Validators.required],
      designation: ['', Validators.required],
      // subject: ['', Validators.required],
      pfNumber: ['', [Validators.required, Validators.pattern('[A-Z]{2}[0-9]{7}')]],
      pran: ['', [Validators.required, Validators.pattern('[A-Z]{4}[0-9]{6}')]],
      fromDate: ['', [minAndMaxDateValidator('1900-01-01',true,false),Validators.required]],
      toDate: ['', [minAndMaxDateValidator('1900-01-01',true,false),Validators.required]],
      retirement: ['', [minAndMaxDateValidator('1900-01-01',true,false),Validators.required]],
      schoolName: ['', Validators.required],
      pCategory: ['', Validators.required],
      // schoolType: ['', Validators.required],
      // trained: ['', Validators.required],
      // trainingAttended: ['', Validators.required],
      eligibleTestQualified: ['', Validators.required],
      approvalType: ['', Validators.required],
      approvalTypeReason:[''],
      protectedTeacher: ['', Validators.required]
    },
      //  { validators: dateRangeValidator('startDate', 'endDate') }
    );


    this.educationForm = this.fb.group({
      educations: this.fb.array([]) // Initialize as empty array

    });
    this.documentForm = this.fb.group({
      documents: this.fb.array([])
    })

    // this function invoke when change married field 
    this.onMaritalStatusChange()

    this.checkEducationTypeToSetEligibilityTest()

  }

  ngOnInit() {

    this.loadAllData();
    const coursesArray = this.educationForm.get('educations') as FormArray;


    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      if (id) {
        this.isEdited = true;
        this.employeeId = id;
        this.personalDetailsForm.disable()
        this.educationForm.disable()
        this.loadEmployeeData(this.employeeId);

      }
    });

   

    if (coursesArray.length === 0) {
      debugger
      this.addCourse();


      // this.addCourse();
    }
    // this.onCourseNameSelectOtherToAddValidation()

  }

  loadEmployeeData(id: number) {
    this.dataService.getTeacherById(id).subscribe({
      next: (response: any) => {
        if (response) {
        
          this.employee = response
          if(this.employee.department.employeeTypeID ==2){
            this.setValuesForEdit()
          }else{
            this.router.navigate([`non-teachers/non-teacher-list`])
          }
         
         
        }

      },
      error: (error: any) => {
        this.router.navigate(['teachers/view-teacher', this.employeeId])

      },
      complete: () => {

      }
    })
  }

  setValuesForEdit() {
    debugger
    this.patchPersonalFormData()
    this.patchEducationFormData()
    this.patchDocumentsFormData();
    this.patchExpForm();

  }

  patchPersonalFormData() {
    debugger
    forkJoin({
      religions: this.dataService.getAllReligions(),
      maritalStatuses: this.dataService.getAllMaritalStatuses(),
      genders: this.dataService.getAllGenders(),
      casteCategories: this.dataService.getAllCasteCategories(),
      bloodGroups: this.dataService.getAllBloodGroups(),
    }).subscribe((results: any) => {
      debugger

      this.religions = results.religions;
      this.maritalStatuses = results.maritalStatuses;
      this.genders = results.genders;
      this.casteCategories = results.casteCategories;
      this.bloodGroups = results.bloodGroups;


      // const personalData = {
      //   firstName: this.employee.firstName,
      //   lastName: this.employee.lastName,
      //   email: this.employee.email,
      //   phone: this.employee.phone,
      //   presentAddress: this.employee.presentAddress,
      //   permanentAddress: this.employee.permanentAddress,
      //   dateOfBirth: this.employee.dateOfBirth,
      //   gender: this.employee.gender,
      //   sexID: this.employee.sexID,
      //   religionID: this.employee.religionID,
      //   casteID: this.employee.casteID,
      //   caste: this.employee.caste,
      //   bloodName: this.employee.bloodName,
      //   bloodGroupID: this.employee.bloodGroupID,
      //   rationID: this.employee.rationID,
      //   differentlyAbled: this.employee.differentlyAbled,
      //   exServiceMen: this.employee.exServiceMen,
      //   aadhaarID: this.employee.aadhaarID,
      //   identificationMark1: this.employee.identificationMark1,
      //   identificationMark2: this.employee.identificationMark1,
      //   height: this.employee.height,
      //   fatherName: this.employee.fatherName,
      //   motherName: this.employee.motherName,
      //   interReligion: this.employee.interReligion,
      //   maritalStatusID: this.employee.maritalStatusID,
      //   spouseName: this.employee.spouseName,
      //   spouseReligionID: this.employee.spouseReligionID,
      //   spouseCaste: this.employee.spouseCaste,
      //   panID: this.employee.panID,
      //   voterID: this.employee.voterID,
      //   pen: this.employee.pen,
      //   photoPath: this.employee.photopath,
      //   photoId: this.employee.photoID
      // };
      const personalData = {
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        email: this.employee.email,
        phone: this.employee.phone,
        presentAddress: this.employee.presentAddress,
        permanentAddress: this.employee.permanentAddress,
        dateOfBirth: this.employee.dateOfBirth,
        gender: this.employee.genderDTO,
        sexID: this.employee.genderDTO.genderID,
        religionID: this.employee.religionDTO?.religionID,
        casteID: this.employee.casteCategoryDTO?.casteCategoryID,
        caste: this.employee.casteName,
        bloodName: this.employee.bloodGroupDTO?.bloodGroupName,
        bloodGroupID: this.employee.bloodGroupDTO.bloodGroupID,
        rationID: this.employee.rationID,
        differentlyAbled: this.employee.differentlyAbled,
        exServiceMen: this.employee.exServiceMen,
        aadhaarID: this.employee.aadhaarID,
        identificationMark1: this.employee.identificationMark1,
        identificationMark2: this.employee.identificationMark2,
        height: this.employee.height,
        fatherName: this.employee.fatherName,
        motherName: this.employee.motherName,
        interReligion: this.employee.interReligion,
        maritalStatusID: this.employee.maritalStatusDTO.maritalStatusID,
        spouseName: this.employee.spouseName,
        spouseReligionID: this.employee.spouseReligionDTO.religionID,
        spouseCaste: this.employee.spouseCaste,
        panID: this.employee.panID,
        voterID: this.employee.voterID,
        pen: this.employee.pen,
        photoPath: this.employee.photopath,
        photoDetails: this.employee.photoDTO,
      };

      this.personalDetailsForm.patchValue({
        permanentEmployeeNumber: personalData.pen,
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        sex: this.genders.find((gen) => gen.genderID === personalData.sexID),
        dob: this.dataService.formatDateToLocal(personalData.dateOfBirth),
        phone: personalData.phone,
        email: personalData.email,
        religion: this.religions.find(religion => religion.religionID === personalData.religionID),
        category: this.casteCategories.find(category => category.casteCategoryID === personalData.casteID),
        caste: personalData.caste,
        bloodGroup: this.bloodGroups.find((blood) => blood.bloodGroupID === personalData.bloodGroupID),
        whetherDifferentlyAbled: personalData.differentlyAbled,
        exServicemen: personalData.exServiceMen,
        identificationMarksOne: personalData.identificationMark1,
        identificationMarksTwo: personalData.identificationMark2,
        height: personalData.height,
        aadharId: personalData.aadhaarID,
        pan: personalData.panID,
        rationCardNumber: personalData.rationID,
        voterId: personalData.voterID,
        currentAddress: personalData.presentAddress,
        permanentAddress: personalData.permanentAddress,
        fathersName: personalData.fatherName,
        mothersName: personalData.motherName,
        interReligion: personalData.interReligion,
        maritalStatus: this.maritalStatuses.find(status => status.maritalStatusID === personalData.maritalStatusID),
        spousesName: personalData.spouseName,
        spousesReligion: personalData.spouseReligionID ? this.religions.find(religion => religion.religionID === personalData.spouseReligionID) : '',
        spousesCaste: personalData.spouseCaste,
        photoId: { photoId: personalData.photoDetails?.photoID, photoImageName: personalData.photoDetails?.photoName }

      });
      this.personalDetailsForm.enable()

    });

  }

  patchEducationFormData() {
    debugger
    forkJoin({
      allEducationTypes: this.dataService.getAllCourses(),
    }).subscribe((response: any) => {
      this.allEducationTypes = response.allEducationTypes
      debugger
      const educationData = this.employee.getEducations;

      this.educationForm.setControl('educations', this.fb.array(
        educationData.map((education: any) => this.fb.group({
          educationType: [this.allEducationTypes.find((item: any) => item.educationTypeID === education.educationTypeID)],
          courseName: [{ courseID: education.courseID, courseName: education.courseText }],
          courseNameOther: [education.courseName],
          schoolName: [
            education.schoolName,
            education.educationTypeID === 5
              ? []
              : [Validators.required],
          ],

          fromDate: [
            education.fromDate ? this.dataService.formatYearmonthToLocal(education.fromDate) : '',
            education.educationTypeID === 5
              ? []
              : [minAndMaxDateValidator('1900-01-01', true, true), Validators.required],
          ],
          toDate: [this.dataService.formatYearmonthToLocal(education.toDate), [minAndMaxDateValidator('1900-01-01',true,true),Validators.required]],
         
          certificate: [(education.documentID && education.documentpath) ? { documentID: education.documentID, documentName: education.documentpath } : null, [Validators.required]]
        },
          {
            validators: dateRangeValidator('fromDate', 'toDate')

          }
        ))
      ));
      // this.educationForm = { ...this.educationForm };
      this.educationForm = new FormGroup(this.educationForm.controls);
      this.educationForm.enable()
      this.checkEducationTypeToSetEligibilityTest()


      debugger

    })


    // const educations = this.educationForm.get('educations') as FormArray;
    // educationData.forEach((education: any) => {
    //   educations.push(this.fb.group({
    //     schoolName: [education.schoolName, Validators.required],
    //     fromDate: [this.dataService.formatDateToLocal(education.fromDate), Validators.required],
    //     toDate: [this.dataService.formatDateToLocal(education.toDate), Validators.required],
    //     documentID: [education.documentID, Validators.required]
    //   }));
    // });

  }

  patchExpForm() {
    debugger

    forkJoin({
      subjects: this.dataService.getAllSubjects(),
      statuses: this.dataService.getAllStatuses(),
      schools: this.dataService.getAllSchools(),



      employeeTypes: this.dataService.getAllEmployeeTypes(),
      designations: this.dataService.getAllDesignations(),
      employeeCategories: this.dataService.getAllEmployeeCategories(),
      schoolNameWithCity: this.dataService.getSchoolWithCity(),
      districts: this.dataService.getAllDistricts(),
      // allEducationTypes: this.dataService.getAllCourses(),
      cities: this.dataService.getAllCities(),

      approvalTypes: this.dataService.getAllApprovalTypes(),

      // coursesByEducation: this.educationTypeId ? this.dataService.getCoursesByEducationType(this.educationTypeId) : []
    }).subscribe((results) => {

      // Assign the results to your component variables
      this.subjects = results.subjects;
      this.statuses = results.statuses;
      this.schools = results.schools;

      this.employeeTypes = results.employeeTypes.filter((item: any) => item.employeeTypeID === 2);
      this.designationsList = results.designations;
      this.employeeCategories = results.employeeCategories;
      this.schoolNameWithCity = results.schoolNameWithCity;
      this.districts = results.districts;

      this.approvalTypes = results.approvalTypes;

      // const professionalData = {

      //   departmentID: this.employee.departmentID,
      //   districtID: this.employee.districtID,
      //   pfNummber: this.employee.pfNumber,
      //   pran: this.employee.pran,
      //   SchoolID: this.employee.schoolID,
      //   ApprovalTypeID: this.employee.approvalTypeID,

      //   categoryID: this.employee.categoryID,

      //   // documentID: parseInt(this.fullFormData.documentID),
      //   EligibilityTestQualified: this.employee.eligibilityTestQualified,
      //   ProtectedTeacher: this.employee.protectedTeacher,

      //   designationID: this.employee.designationID,
      //   // subjectID: this.employee.subjectID,
      //   // employeeTypeID: this.employee.departmentID,
      //   dateOfJoin: this.dataService.formatDateToLocal(this.employee.dateofJoin),
      //   dateOfJoinDepartment: this.dataService.formatDateToLocal(this.employee.dateofDepartmentJoin),
      //   RetirementDate: this.dataService.formatDateToLocal(this.employee.retirementDate),
      //   promotionEligible: this.employee.promotionEligible,



      // };
      const professionalData = {

        departmentID: this.employee.department.employeeTypeID,
        districtID: this.employee.districtDTO.districtID,
        pfNummber: this.employee.pfNumber,
        pran: this.employee.pran,
        SchoolID: this.employee.schoolDTO?.schoolId,
        ApprovalTypeID: this.employee.getApprovalTypeDTO?.approvalTypeID,
        approvalTypeReason:this.employee.approvalTypeReason,
        categoryID: this.employee.getEmployeeCategoryDTO?.employeeCategoryId,

        // documentID: parseInt(this.fullFormData.documentID),
        EligibilityTestQualified: this.employee.eligibilityTestQualified,
        ProtectedTeacher: this.employee.protectedTeacher,

        designationID: this.employee.designationDTO?.designationID,
        subjectID: this.employee.getSubjectDTO?.subjectID,
        // employeeTypeID: this.employee.departmentID,
        dateOfJoin: this.dataService.formatDateToLocal(this.employee.dateofJoin),
        dateOfJoinDepartment: this.dataService.formatDateToLocal(this.employee.dateofDepartmentJoin),
        RetirementDate: this.dataService.formatDateToLocal(this.employee.retirementDate),
        promotionEligible: this.employee.promotionEligible,



      };
    

      // this.professionalForm.patchValue({
      //   department: this.employeeTypes.find((dep: any) => dep.employeeTypeID === professionalData.departmentID),
      //   district: this.districts.find((dist: any) => dist.districtID === professionalData.districtID),
      //   serviceCategory: [''],
      //   // employeeType: this.employeeTypes.find((dep: any) => dep.employeeTypeID === professionalData.employeeTypeID),
      //   designation: this.designationsList.find((des: any) => des.designationID === professionalData.designationID),
      //   // subject: this.subjects.find((sub: any) => sub.subjectID === professionalData.subjectID),
      //   pfNumber: professionalData.pfNummber,
      //   pran: professionalData.pran,
      //   fromDate: this.dataService.formatDateToLocal(professionalData.dateOfJoin),
      //   toDate: this.dataService.formatDateToLocal(professionalData.dateOfJoinDepartment),
      //   retirement: this.dataService.formatDateToLocal(professionalData.RetirementDate),
      //   schoolName: this.schoolNameWithCity.find((school: any) => school.schoolID === professionalData.SchoolID),
      //   pCategory: this.employeeCategories.find((emp: any) => emp.employeeCategoryId === professionalData.categoryID),
      //   // schoolType: ['', Validators.required],
      //   // trained: ['', Validators.required],
      //   // trainingAttended: ['', Validators.required],
      //   eligibleTestQualified: professionalData.EligibilityTestQualified,
      //   approvalType: this.approvalTypes.find((apr: any) => apr.approvalTypeID === professionalData.ApprovalTypeID),
      //   protectedTeacher: professionalData.ProtectedTeacher
      // })
      this.professionalForm.patchValue({
        department: this.employeeTypes.find((dep: any) => dep.employeeTypeID === professionalData.departmentID),
        district: this.districts.find((dist: any) => dist.districtID === professionalData.districtID),
        serviceCategory: [''],
        // employeeType: this.employeeTypes.find((dep: any) => dep.employeeTypeID === professionalData.employeeTypeID),
        designation: this.designationsList.find((des: any) => des.designationID === professionalData.designationID),
        subject: this.subjects.find((sub: any) => sub.subjectID === professionalData.subjectID),
        pfNumber: professionalData.pfNummber,
        pran: professionalData.pran,
        fromDate: this.dataService.formatDateToLocal(professionalData.dateOfJoin),
        toDate: this.dataService.formatDateToLocal(professionalData.dateOfJoinDepartment),
        retirement: this.dataService.formatDateToLocal(professionalData.RetirementDate),
        schoolName: this.schoolNameWithCity.find((school: any) => school.schoolID === professionalData.SchoolID),
        pCategory: this.employeeCategories.find((emp: any) => emp.employeeCategoryId === professionalData.categoryID),
        // schoolType: ['', Validators.required],
        // trained: ['', Validators.required],
        // trainingAttended: ['', Validators.required],
        eligibleTestQualified: professionalData.EligibilityTestQualified,
        approvalType: this.approvalTypes.find((apr: any) => apr.approvalTypeID === professionalData.ApprovalTypeID),
        approvalTypeReason:professionalData.approvalTypeReason,
        protectedTeacher: professionalData.ProtectedTeacher
      })



    });



  }
  // patchDocumentsFormData() {

  //   const documentData = this.employee.getEmployeeDocuments;
  //   this.documentForm.setControl('documents', this.fb.array(
  //     documentData.map((doc: any) => this.fb.group({

  //       documentType: doc.documentName,
  //       documentFile: { documentID: doc.documentID, documentName: doc.documentpath }

  //     }
  //     ))
  //   ));

  //   this.documentForm = new FormGroup(this.documentForm.controls);
  //   this.documentForm.enable()
  // }
  patchDocumentsFormData() {

    const documentData = this.employee.getEmployeeDocuments;
    console.log("patch doc", documentData)
    this.documentForm.setControl('documents', this.fb.array(
      documentData.map((doc: any) => {
        if (doc.documentID === null) {
          return this.fb.group({
            documentType: ["", documentData.length > 1 ? Validators.required:null],
            documentFile: [{ documentID: "", documentName: "" },documentData.length > 1 ? Validators.required:null]

          }
          )
        }
        return this.fb.group({
          documentType: [doc.documentName,documentData.length > 1 ? Validators.required:null],
          documentFile: [{ documentID: doc.documentID, documentName: doc.documentpath },documentData.length > 1 ? Validators.required:null]

        }
        )
      })
    ));

    this.documentForm = new FormGroup(this.documentForm.controls);
    this.documentForm.enable()
  }


  checkEducationTypeToSetEligibilityTest() {
    debugger

    this.educationForm.get('educations')?.valueChanges.subscribe(educationArray => {

      debugger;
      const hasTeacherTraining = educationArray.some((edu: any) => edu.educationType.educationTypeID === 4);

      if (hasTeacherTraining) {
        this.professionalForm.get('eligibleTestQualified')?.setValue(true);
      } else {
        this.professionalForm.get('eligibleTestQualified')?.setValue(false);
      }


    });

  }

  // Method to update validators based on marital status
  onMaritalStatusChange(): void {

    this.personalDetailsForm.get('maritalStatus')?.valueChanges.subscribe((status) => {

      if (status.maritalStatusID == '2') {
        // Add Validators.required to spouse-related fields
        this.personalDetailsForm.get('spousesName')?.setValidators([Validators.required,Validators.pattern('^[a-zA-Z ]*$')]);
        this.personalDetailsForm.get('spousesReligion')?.setValidators([Validators.required]);
        this.personalDetailsForm.get('spousesCaste')?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z ]*$')]);
      } else {
        // Clear Validators for spouse-related fields if not married
        this.personalDetailsForm.get('spousesName')?.clearValidators();
        this.personalDetailsForm.get('spousesReligion')?.clearValidators();
        this.personalDetailsForm.get('spousesCaste')?.clearValidators();
        
        this.personalDetailsForm.get('spousesName')?.setValue("")
        this.personalDetailsForm.get('spousesReligion')?.setValue("")
        this.personalDetailsForm.get('spousesCaste')?.setValue("")
      }

      // Update validation status after modifying validators
      this.personalDetailsForm.get('spousesName')?.updateValueAndValidity();
      this.personalDetailsForm.get('spousesReligion')?.updateValueAndValidity();
      this.personalDetailsForm.get('spousesCaste')?.updateValueAndValidity();
    });
  }

  onCourseNameSelectOtherToAddValidation(): void {
    debugger

    this.educationForm.get('educations')?.valueChanges.pipe(distinctUntilChanged()).subscribe(educationArray => {
      debugger
  
      const educations = this.educationForm.get('educations') as FormArray;

      educationArray.forEach((education: any, index: number) => {

        const educationGroup = educations.at(index) as FormGroup;
        const courseNameControl = educationGroup.get('courseName');
        const courseNameOtherControl = educationGroup.get('courseNameOther');

        if (courseNameControl?.value.courseName === 'Others') {
          // Add 'required' validator to courseNameOther if courseName is 'Others'
          courseNameOtherControl?.setValidators([Validators.required]);
        } else {
          // Remove 'required' validator from courseNameOther
          courseNameOtherControl?.clearValidators();
        }
        debugger

        // Recalculate validation status
        courseNameOtherControl?.updateValueAndValidity();
      });

      debugger
    });
  }


  // loadAllData(): void {
  //   this.dataService.getAllSubjects().subscribe(data => {
  //     this.subjects = data;
  //     console.log('Subjects:', this.subjects);
  //   });
  //   this.dataService.getAllStatuses().subscribe(data => {
  //     this.statuses = data;
  //     console.log('Statuses:', this.statuses);
  //   });
  //   this.dataService.getAllSchools().subscribe(data => {
  //     this.schools = data;
  //     console.log('Schools:', this.schools);
  //   });
  //   this.dataService.getAllReligions().subscribe(data => {
  //     this.religions = data;
  //     console.log('Religions:', this.religions);
  //   });
  //   this.dataService.getAllMaritalStatuses().subscribe(data => {
  //     this.maritalStatuses = data;
  //     console.log('Marital Statuses:', this.maritalStatuses);
  //   });
  //   this.dataService.getAllGenders().subscribe(data => {
  //     this.genders = data;
  //     console.log('Genders:', this.genders);
  //   });
  //   this.dataService.getAllEmployeeTypes().subscribe(data => {
  //     this.employeeTypes = data;
  //     console.log('Employee Types:', this.employeeTypes);
  //   });
  //   this.dataService.getAllDesignations().subscribe(data => {
  //     this.designationsList = data;
  //     console.log('Designation:', this.employeeTypes);
  //   });
  //   this.dataService.getAllEmployeeCategories().subscribe(data => {
  //     this.employeeCategories = data;
  //     console.log('Employee Categories:', this.employeeCategories);
  //   });
  //   this.dataService.getSchoolWithCity().subscribe(data => {
  //     this.schoolNameWithCity = data;
  //     console.log('Schoolname with city:', this.schoolNameWithCity);
  //   });
  //   this.dataService.getAllDistricts().subscribe(data => {
  //     this.districts = data;
  //     console.log('Districts:', this.districts);
  //   });
  //   this.dataService.getAllCourses().subscribe(data => {
  //     this.allEducationTypes = data;
  //     console.log('All Education Types:', this.allEducationTypes);
  //   });
  //   if (this.educationTypeId) {
  //     this.dataService.getCoursesByEducationType(this.educationTypeId).subscribe(data => {
  //       this.coursesByEducation = data;
  //       console.log('Courses by Education:', this.coursesByEducation);
  //     });
  //   }
  //   this.dataService.getAllCities().subscribe(data => {
  //     this.cities = data;
  //     console.log('Cities:', this.cities);
  //   });
  //   this.dataService.getAllCasteCategories().subscribe(data => {
  //     this.casteCategories = data;
  //     console.log('Caste Categories:', this.casteCategories);
  //   });
  //   this.dataService.getAllBloodGroups().subscribe(data => {
  //     this.bloodGroups = data;
  //     console.log('Blood Groups:', this.bloodGroups);
  //   });
  //   this.dataService.getAllApprovalTypes().subscribe(data => {
  //     this.approvalTypes = data;
  //     console.log('Approval Types:', this.approvalTypes);
  //   });

  // }

  loadAllData(): void {
    forkJoin({
      // subjects: this.dataService.getAllSubjects(),
      statuses: this.dataService.getAllStatuses(),
      schools: this.dataService.getAllSchools(),
      religions: this.dataService.getAllReligions(),
      maritalStatuses: this.dataService.getAllMaritalStatuses(),
      genders: this.dataService.getAllGenders(),
      employeeTypes: this.dataService.getAllEmployeeTypes(),
      designations: this.dataService.getAllDesignations(),
      employeeCategories: this.dataService.getAllEmployeeCategories(),
      schoolNameWithCity: this.dataService.getSchoolWithCity(),
      districts: this.dataService.getAllDistricts(),
      allEducationTypes: this.dataService.getAllCourses(),
      cities: this.dataService.getAllCities(),
      casteCategories: this.dataService.getAllCasteCategories(),
      bloodGroups: this.dataService.getAllBloodGroups(),
      approvalTypes: this.dataService.getAllApprovalTypes()
    }).subscribe({
      next: (data: any) => {
        // this.subjects = data.subjects;
        this.statuses = data.statuses;
        this.schools = data.schools;
        this.religions = data.religions;
        this.maritalStatuses = data.maritalStatuses;
        this.genders = data.genders;
        this.employeeTypes = data.employeeTypes.filter((item: any) => item.employeeTypeID === 2);

        this.designationsList = data.designations.filter((item:any)=> item.designationID  ==7);
        this.employeeCategories = data.employeeCategories;
        this.schoolNameWithCity = data.schoolNameWithCity;
        this.districts = data.districts;
        this.allEducationTypes = data.allEducationTypes;
        this.cities = data.cities;
        this.casteCategories = data.casteCategories;
        this.bloodGroups = data.bloodGroups;
        this.approvalTypes = data.approvalTypes;


      },
      error: (err: any) => {
        console.error('Failed to load dropdown data:', err);

      },
      complete: () => {
        // this.professionalForm.get('department')?.patchValue({employeeTypeID: 2, employeeTypeName: 'Non-Teaching Staff'});
      }
    });


  }

  addCourse() {
    const courseGroup = this.fb.group({
      educationType: ['', Validators.required],
      courseName: ['', Validators.required],
      courseNameOther: [''],
      schoolName: ['',],
      fromDate: ['',],
      toDate: ['', [minAndMaxDateValidator('1900-01-01', true, true), Validators.required]],
      certificate: ['',Validators.required]
    },
      { validators: dateRangeValidator('fromDate', 'toDate') }
    );
    (this.educationForm.get('educations') as FormArray).push(courseGroup);
  }


  onFormChange(formData: any, value: string): any {
    if (value && value == 'personal') {
      this.personalDetailsForm = formData
    } else if (value && value == 'educational') {
      this.educationForm = formData
    } else if (value && value == 'professional') {
      this.professionalForm = formData
    } else if (value && value == 'summary') {
      this.detailViewForm = formData
    }
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
  get getSidebarToggle() {
    return this.isSidebarClosed;
  }

  switchToPrevious(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }



  // saveAndContinue() {
  //   debugger
  //   let currentForm: FormGroup;

  //   switch (this.currentStep) {
  //     case 1:
  //       currentForm = this.personalDetailsForm;
  //       this.submitBtnStatus.personal = true
  //       break;
  //     case 2:
  //       currentForm = this.educationForm;
  //       this.submitBtnStatus.education = true
  //       break;
  //     case 3:
  //       currentForm = this.professionalForm;
  //       this.submitBtnStatus.professional = true
  //       break;
  //     default:
  //       currentForm = this.professionalForm;
  //       break;
  //   }

  //   if (currentForm.valid) {
  //     if (this.currentStep <= this.steps.length) {
  //       this.currentStep++;

  //       if (this.currentStep === this.steps.length) {
  //         this.onSubmit(); // Collect form data for preview
  //       }
  //       if (this, this.currentStep === this.steps.length + 1) {
  //         this.previewSubmit()
  //       }
  //     }

  //   } else {
  //     console.log('Form is invalid. Please check your inputs.');
  //   }

  // }
  saveAndContinue() {
    debugger;
    const formMapping: { [key: number]: { form: FormGroup; statusKey: keyof SubmitBtnStatus } } = {
      1: { form: this.personalDetailsForm, statusKey: 'personal' },
      2: { form: this.educationForm, statusKey: 'education' },
      3: { form: this.professionalForm, statusKey: 'professional' },
      4: { form: this.documentForm, statusKey: 'documents' },
      5: { form: this.professionalForm, statusKey: 'professional' },
    };
    const currentMapping = formMapping[this.currentStep];
    if (!currentMapping) {
      console.error('Invalid step');
      return;
    }

    const { form: currentForm, statusKey } = currentMapping;

    // Update submit button status
    this.submitBtnStatus[statusKey] = true;

    // Check form validity or allow the final step
    if (currentForm.valid ) {
      this.currentStep++;
      if (this.currentStep === this.steps.length) {
        this.onSubmit(); // Collect form data for preview
      } else if (this.currentStep === this.steps.length + 1) {
        this.previewSubmit(); // Final preview submission
      }
    } else {
      console.warn('Form is invalid. Please check your inputs.');
    }


  }
  // previewSubmit() {
  //   debugger
  //   let educationData = this.fullFormData.educations.map((edu: any) => ({
  //     educationTypeID: parseInt(edu.educationType.educationTypeID),
  //     courseID: parseInt(edu.courseName.courseID),
  //     courseName: edu.courseNameOther,
  //     schoolName: edu.schoolName,
  //     fromDate: this.dataService.formatDateToISO(edu.fromDate),
  //     toDate: this.dataService.formatDateToISO(edu.toDate),
  //     DocumentID: parseInt(edu.certificate?.documentID) || null
  //   }));

  //   let documentData = this.fullFormData.documents.map((doc: any) => ({
  //     documentID: doc.documentFile.documentID
  //   }));

    // let data: any = {
    //   pen: this.fullFormData.permanentEmployeeNumber ? this.fullFormData.permanentEmployeeNumber : "",
    //   firstName: this.fullFormData.firstName ? this.fullFormData.firstName : "",
    //   lastName: this.fullFormData.lastName ? this.fullFormData.lastName : "",
    //   email: this.fullFormData.email ? this.fullFormData.email : "",
    //   phone: this.fullFormData.phone ? this.fullFormData.phone : "",
    //   presentAddress: this.fullFormData.currentAddress ? this.fullFormData.currentAddress : "",
    //   permanentAddress: this.fullFormData.permanentAddress ? this.fullFormData.permanentAddress : "",
    //   dateOfBirth: this.dataService.formatDateToISO(this.fullFormData.dob),
    //   sexID: parseInt(this.fullFormData.sex.genderID),
    //   religionID: parseInt(this.fullFormData.religion.religionID),
    //   casteID: parseInt(this.fullFormData.category.casteCategoryID),
    //   caste: this.fullFormData.caste ? this.fullFormData.caste : "",
    //   bloodGroupID: parseInt(this.fullFormData.bloodGroup.bloodGroupID),
    //   // rationID: this.fullFormData.rationCardNumber,
    //   differentlyAbled: Boolean(this.fullFormData.whetherDifferentlyAbled),
    //   exServiceMen: Boolean(this.fullFormData.exServicemen),
    //   aadhaarID: this.fullFormData.aadharId ? this.fullFormData.aadharId : "",
    //   identificationMark1: this.fullFormData.identificationMarksOne ? this.fullFormData.identificationMarksOne : "",
    //   identificationMark2: this.fullFormData.identificationMarksTwo ? this.fullFormData.identificationMarksTwo : "",
    //   height: this.fullFormData.height ? this.fullFormData.height : "",
    //   fatherName: this.fullFormData.fathersName ? this.fullFormData.fathersName : "",
    //   motherName: this.fullFormData.mothersName ? this.fullFormData.mothersName : "",
    //   interReligion: Boolean(this.fullFormData.interReligion),
    //   maritalStatusID: parseInt(this.fullFormData.maritalStatus.maritalStatusID),
    //   spouseName: this.fullFormData.spousesName ? this.fullFormData.spousesName : "",
    //   spouseReligionID: parseInt(this.fullFormData.spousesReligion.religionID),
    //   statusID: 1,
    //   spouseCaste: this.fullFormData.spousesCaste ? this.fullFormData.spousesCaste : "",
    //   panID: this.fullFormData.pan,
    //   voterID: this.fullFormData.voterId ? this.fullFormData.voterId : "",
    //   educations: educationData,
    //   departmentID: parseInt(this.fullFormData.department.employeeTypeID),
    //   districtID: parseInt(this.fullFormData.district.districtID),
    //   pfNummber: this.fullFormData.pfNumber,
    //   pran: this.fullFormData.pran,
    //   SchoolID: parseInt(this.fullFormData.schoolName.schoolID),
    //   ApprovalTypeID: parseInt(this.fullFormData.approvalType.approvalTypeID),
    //   // dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.dateOfJoin),
    //   // dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.dateOfJoinDepartment),
    //   categoryID: parseInt(this.fullFormData.pCategory.employeeCategoryId),
    //   // schoolTypeID: parseInt(this.fullFormData.schoolTypeID),
    //   // fromDate: this.dataService.formatDateToISO(this.fullFormData.fromDate),
    //   // toDate: this.dataService.formatDateToISO(this.fullFormData.toDate),
    //   // documentID: parseInt(this.fullFormData.documentID),
    //   eligibilityTestQualified: Boolean(this.fullFormData.eligibleTestQualified),
    //   ProtectedTeacher: Boolean(this.fullFormData.protectedTeacher),
    //   // trainingAttended: Boolean(this.fullFormData.trainingAttended),
    //   designationID: this.fullFormData.designation ? parseInt(this.fullFormData.designation.designationID) : null,
    //   // subjectID: parseInt(this.fullFormData.subject.subjectID),
    //   // employeeTypeID: this.fullFormData.employeeType ? parseInt(this.fullFormData.employeeType.employeeTypeID) : null,
    //   dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.fromDate),
    //   dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.toDate),
    //   RetirementDate: this.dataService.formatDateToISO(this.fullFormData.retirement),
    //   promotionEligible: Boolean(this.fullFormData.promotionEligible),
    //   PhotoID: parseInt(this.fullFormData.photoId.photoId),
    //   employeeDocuments: documentData,
    // }

  //   if (this.isEdited) {
  //     debugger
  //     const employeeId: number = Number(this.employeeId)
  //     this.nonTeacherService.updateTeacher(data, employeeId).subscribe(
  //       (response: any) => {
  //         debugger

  //         if (response.status === 200) {
  //           this.submitBtnStatus.personal = false;
  //           this.submitBtnStatus.education = false;
  //           this.submitBtnStatus.professional = false;

  //           this.toastr.success('Employee Updated', 'Success', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.router.navigate(['/non-teachers/non-teacher-list'])


  //         } else {
  //           this.toastr.error('Employee Update !', 'Failed', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.currentStep = 1
  //         }

  //       },
  //       (error: any) => {
  //         if (error.status == 409) {
  //           let message: string = error.error?.message
  //           this.toastr.error(message + '!', 'Failed', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.currentStep = 1
  //           return;
  //         }

  //         this.toastr.error('Somthing Went Wrong !', 'Failed', {
  //           closeButton: true,
  //           progressBar: true,
  //           positionClass: 'toast-top-left',
  //           timeOut: 4500,
  //         });
  //         console.error(error);
  //         this.currentStep = 1
  //       }
  //     );

  //   } else {
  //     debugger
  //     this.nonTeacherService.addTeacher(data).subscribe(
  //       (response: any) => {
  //         debugger
        
  //         if (response.status === 200) {
  //           this.submitBtnStatus.personal = false;
  //           this.submitBtnStatus.education = false;
  //           this.submitBtnStatus.professional = false;

  //           this.toastr.success('Employee Added', 'Success', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.router.navigate(['/non-teachers/non-teacher-list'])

  //         } else {
  //           this.toastr.error('Employee Add !', 'Failed', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.currentStep = 1
  //         }

  //       },
  //       (error: any) => {
  //         if (error.status == 409) {
  //           let message: string = error.error?.message
  //           this.toastr.error(message + '!', 'Failed', {
  //             closeButton: true,
  //             progressBar: true,
  //             positionClass: 'toast-top-left',
  //             timeOut: 4500,
  //           });
  //           this.currentStep = 1
  //           return;
  //         }

  //         this.toastr.error('Somthing Went Wrong !', 'Failed', {
  //           closeButton: true,
  //           progressBar: true,
  //           positionClass: 'toast-top-left',
  //           timeOut: 4500,
  //         });
  //         console.error(error);
  //         this.currentStep = 1
  //       }
  //     );
  //   }




  // }

    // Getter for the FormArray
    get documents(): FormArray {
      return this.documentForm.get('documents') as FormArray;
    }


 async uploadFiles(): Promise<void> {
    debugger;

    try {
      const uploadPromises = this.documents.controls.map((doc: any, index: number) => {
        const file = this.files[index]; // File from input
        const documentType = doc.get('documentType')?.value;
        const existingDocument = doc.get('documentFile')?.value;


        console.log("Existing Document: ", existingDocument,file,documentType);

        // Handle file upload or document update
        if (file) {
          if (this.isEdited && existingDocument?.documentID) {
            // Update existing document with a new file
            return this.handleDocumentUpdate(existingDocument.documentID, documentType, file, index);
          } else {
            // Upload a new document
            return this.handleDocumentUpload(file, documentType, index);
          }
        } else if (existingDocument?.documentID) {
          // Update document type without uploading a new file
          console.log("type update", doc)
          return this.handleDocumentTypeUpdate(existingDocument.documentID, documentType, index);
        }

        // If no file and no existing document, resolve immediately
        return Promise.resolve();
      });

      // Wait for all upload/update promises to complete
      await Promise.all(uploadPromises);
      console.log('All files processed successfully');
    } catch (error) {
      console.error('Error during file upload process:', error);
    }
  }

  private handleDocumentUpdate(
    documentID: number,
    documentType: string,
    file: File,
    index: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.updateDocument(documentID, documentType, file).subscribe(
        (response: any) => {
          console.log('File updated successfully:', response);
          this.patchDocumentForm(index, { documentID, documentName: documentType });
          resolve(response);
        },
        (error: any) => {
          console.error('Error updating file:', error);
          reject(error);
        }
      );
    });
  }

  private handleDocumentUpload(file: File, documentType: string, index: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.uploadDocumentByDocumentType(file, documentType).subscribe(
        (response: any) => {
          console.log('File uploaded successfully:', response);
          this.patchDocumentForm(index, response);
          resolve(response);
        },
        (error: any) => {
          console.error('Error uploading file:', error);
          reject(error);
        }
      );
    });
  }

  private handleDocumentTypeUpdate(documentID: number, documentType: string, index: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dataService.updateDocument(documentID, documentType).subscribe(
        (response: any) => {
          console.log('Document type updated successfully:', response);
          this.patchDocumentForm(index, { documentID, documentName: documentType });
          resolve(response);
        },
        (error: any) => {
          console.error('Error updating document type:', error);
          reject(error);
        }
      );
    });
  }

  private patchDocumentForm(index: number, value: any): void {
    const documents = this.documentForm.get('documents') as FormArray;
    documents.at(index).get('documentFile')?.patchValue(value);
  }




  uploadCertificate(file: any) {
    if (file && file.file) {
      // Check if the document already has a documentID
      if (file.documentID) {
        // Update existing document if documentId is present
        return this.dataService.updateCertificate(file.documentID, file.file).pipe(
          map((response: any) => ({
            documentID: file.documentID,
            documentName: response?.documentName || "", // Ensure documentName is set
          }))
        );
      } else {
        // Upload a fresh document if no documentId is present
        return this.dataService.uploadDocument(file.file).pipe(
          map((uploadResponse: any) => ({
            documentID: uploadResponse?.documentID || null, // Ensure documentID is set from response
            documentName: uploadResponse?.documentName || "", // Handle missing documentName gracefully
          }))
        );
      }
    } else {
      // Return a default object if no file is provided
      return of({
        documentID: file?.documentID || null,  // Ensure default value for documentID
        documentName: file?.documentName || "", // Ensure default value for documentName
      });
    }
  }

  profileImageUpload(profileImage: any) {
    console.log("photoo", profileImage)
    let file = profileImage.file
    if (file) {
      if (profileImage.photoId) {
        console.log("update image")
        return this.dataService.updateImage(profileImage.photoId, file)
      } else {
        console.log("upload image")
        return this.dataService.uploadProfilePhoto(file)
      }


    } else {
      return of({ photoID: profileImage.photoId, photoImageName: profileImage.photoImageName })
    }


  }


  async previewSubmit() {
    try {
      debugger;
      await this.uploadFiles(); // Ensure this completes before moving forward

      console.log("education", this.fullFormData.educations,this.fullFormData)

      
      const certificateUploadObservables = this.fullFormData.educations.map((edu: any) => {
        const file = edu.certificate;
        return this.uploadCertificate(file);
      });
      let profileImageControl = this.personalDetailsForm.get('photoId')?.value;
      console.log("pgoto Control",profileImageControl)

      forkJoin(certificateUploadObservables).subscribe((response: any) => {
        console.log("uploadCerti", response)


        this.profileImageUpload(profileImageControl).subscribe((profileImageRes: any) => {

          console.log("profile", profileImageRes)
          this.fullFormData.photoId = profileImageRes

          const documents = this.documentForm.get('documents') as FormArray;
          let educationData = this.fullFormData.educations.map((edu: any, index: number) => ({
            educationTypeID: parseInt(edu.educationType.educationTypeID),
            courseID: parseInt(edu.courseName.courseID),
            courseName: edu.courseNameOther,
            schoolName: edu.schoolName,
            fromDate: this.dataService.formatDateToISO(edu.fromDate),
            toDate: this.dataService.formatDateToISO(edu.toDate),
            DocumentID: response[index]?.documentID || null,
          }));

          console.log("education data", educationData)


          const documentData = documents.value.map((doc: any) => {
            if (doc.documentFile && doc.documentFile.documentID) {
              return { documentID: doc.documentFile.documentID }
            } else {
              return null
            }

          }).filter((item: any) => item != null)

          console.log("DOCS", documentData, documents)






          // let data: any = {
          //   pen: this.fullFormData.permanentEmployeeNumber ? this.fullFormData.permanentEmployeeNumber : "",
          //   firstName: this.fullFormData.firstName ? this.fullFormData.firstName : "",
          //   lastName: this.fullFormData.lastName ? this.fullFormData.lastName : "",
          //   email: this.fullFormData.email ? this.fullFormData.email : "",
          //   phone: this.fullFormData.phone ? this.fullFormData.phone : "",
          //   presentAddress: this.fullFormData.currentAddress ? this.fullFormData.currentAddress : "",
          //   permanentAddress: this.fullFormData.permanentAddress ? this.fullFormData.permanentAddress : "",
          //   dateOfBirth: this.dataService.formatDateToISO(this.fullFormData.dob),
          //   sexID: parseInt(this.fullFormData.sex.genderID),
          //   religionID: parseInt(this.fullFormData.religion.religionID),
          //   casteID: parseInt(this.fullFormData.category.casteCategoryID),
          //   caste: this.fullFormData.caste ? this.fullFormData.caste : "",
          //   bloodGroupID: parseInt(this.fullFormData.bloodGroup.bloodGroupID),
          //   // rationID: this.fullFormData.rationCardNumber,
          //   differentlyAbled: Boolean(this.fullFormData.whetherDifferentlyAbled),
          //   exServiceMen: Boolean(this.fullFormData.exServicemen),
          //   aadhaarID: this.fullFormData.aadharId ? this.fullFormData.aadharId : "",
          //   identificationMark1: this.fullFormData.identificationMarksOne ? this.fullFormData.identificationMarksOne : "",
          //   identificationMark2: this.fullFormData.identificationMarksTwo ? this.fullFormData.identificationMarksTwo : "",
          //   height: this.fullFormData.height ? this.fullFormData.height : "",
          //   fatherName: this.fullFormData.fathersName ? this.fullFormData.fathersName : "",
          //   motherName: this.fullFormData.mothersName ? this.fullFormData.mothersName : "",
          //   interReligion: Boolean(this.fullFormData.interReligion),
          //   maritalStatusID: parseInt(this.fullFormData.maritalStatus.maritalStatusID),
          //   spouseName: this.fullFormData.spousesName ? this.fullFormData.spousesName : "",
          //   spouseReligionID: parseInt(this.fullFormData.spousesReligion.religionID),
          //   // statusID: 1,
          //   spouseCaste: this.fullFormData.spousesCaste ? this.fullFormData.spousesCaste : "",
          //   panID: this.fullFormData.pan,
          //   voterID: this.fullFormData.voterId ? this.fullFormData.voterId : "",
          //   educations: educationData,
          //   employeeDocuments: documentData,
          //   departmentID: parseInt(this.fullFormData.department.employeeTypeID),
          //   districtID: parseInt(this.fullFormData.district.districtID),
          //   pfNummber: this.fullFormData.pfNumber,
          //   pran: this.fullFormData.pran,
          //   SchoolID: parseInt(this.fullFormData.schoolName.schoolID),
          //   ApprovalTypeID: parseInt(this.fullFormData.approvalType.approvalTypeID),
          //   // dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.dateOfJoin),
          //   // dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.dateOfJoinDepartment),
          //   categoryID: parseInt(this.fullFormData.pCategory.employeeCategoryId),
          //   // schoolTypeID: parseInt(this.fullFormData.schoolTypeID),
          //   // fromDate: this.dataService.formatDateToISO(this.fullFormData.fromDate),
          //   // toDate: this.dataService.formatDateToISO(this.fullFormData.toDate),
          //   documentID: parseInt(this.fullFormData.documentID),
          //   eligibilityTestQualified: Boolean(this.fullFormData.eligibleTestQualified
          //   ),
          //   ProtectedTeacher: Boolean(this.fullFormData.protectedTeacher),
          //   // trainingAttended: Boolean(this.fullFormData.trainingAttended),
          //   designationID: this.fullFormData.designation ? parseInt(this.fullFormData.designation.designationID) : null,
          //   subjectID: parseInt(this.fullFormData.subject.subjectID),
          //   // employeeTypeID: this.fullFormData.employeeType ? parseInt(this.fullFormData.employeeType.employeeTypeID) : null,
          //   dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.fromDate),
          //   dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.toDate),
          //   RetirementDate: this.dataService.formatDateToISO(this.fullFormData.retirement),
          //   promotionEligible: Boolean(this.fullFormData.promotionEligible),
          //   PhotoID: parseInt(this.fullFormData.photoId.photoID),
          // }


          let data: any = {
            pen: this.fullFormData.permanentEmployeeNumber ? this.fullFormData.permanentEmployeeNumber : "",
            firstName: this.fullFormData.firstName ? this.fullFormData.firstName : "",
            lastName: this.fullFormData.lastName ? this.fullFormData.lastName : "",
            email: this.fullFormData.email ? this.fullFormData.email : "",
            phone: this.fullFormData.phone ? this.fullFormData.phone : "",
            presentAddress: this.fullFormData.currentAddress ? this.fullFormData.currentAddress : "",
            permanentAddress: this.fullFormData.permanentAddress ? this.fullFormData.permanentAddress : "",
            dateOfBirth: this.dataService.formatDateToISO(this.fullFormData.dob),
            sexID: parseInt(this.fullFormData.sex.genderID),
            religionID: parseInt(this.fullFormData.religion.religionID),
            casteID: parseInt(this.fullFormData.category.casteCategoryID),
            caste: this.fullFormData.caste ? this.fullFormData.caste : "",
            bloodGroupID: parseInt(this.fullFormData.bloodGroup.bloodGroupID),
            // rationID: this.fullFormData.rationCardNumber,
            differentlyAbled: Boolean(this.fullFormData.whetherDifferentlyAbled),
            exServiceMen: Boolean(this.fullFormData.exServicemen),
            aadhaarID: this.fullFormData.aadharId ? this.fullFormData.aadharId : "",
            identificationMark1: this.fullFormData.identificationMarksOne ? this.fullFormData.identificationMarksOne : "",
            identificationMark2: this.fullFormData.identificationMarksTwo ? this.fullFormData.identificationMarksTwo : "",
            height: this.fullFormData.height ? this.fullFormData.height : "",
            fatherName: this.fullFormData.fathersName ? this.fullFormData.fathersName : "",
            motherName: this.fullFormData.mothersName ? this.fullFormData.mothersName : "",
            interReligion: Boolean(this.fullFormData.interReligion),
            maritalStatusID: parseInt(this.fullFormData.maritalStatus.maritalStatusID),
            spouseName: this.fullFormData.spousesName ? this.fullFormData.spousesName : "",
            spouseReligionID: parseInt(this.fullFormData.spousesReligion.religionID),
            statusID: 1,
            spouseCaste: this.fullFormData.spousesCaste ? this.fullFormData.spousesCaste : "",
            panID: this.fullFormData.pan,
            voterID: this.fullFormData.voterId ? this.fullFormData.voterId : "",
            educations: educationData,
            departmentID: parseInt(this.fullFormData.department.employeeTypeID),
            districtID: parseInt(this.fullFormData.district.districtID),
            pfNummber: this.fullFormData.pfNumber,
            pran: this.fullFormData.pran,
            SchoolID: parseInt(this.fullFormData.schoolName.schoolID),
            ApprovalTypeID: parseInt(this.fullFormData.approvalType.approvalTypeID),
            approvalTypeReason:this.fullFormData.approvalTypeReason,
            categoryID: parseInt(this.fullFormData.pCategory.employeeCategoryId),
           
            eligibilityTestQualified: Boolean(this.fullFormData.eligibleTestQualified),
            ProtectedTeacher: JSON.parse(this.fullFormData.protectedTeacher),
            // trainingAttended: Boolean(this.fullFormData.trainingAttended),
            designationID: this.fullFormData.designation ? parseInt(this.fullFormData.designation.designationID) : null,
            // subjectID: parseInt(this.fullFormData.subject.subjectID),
            // employeeTypeID: this.fullFormData.employeeType ? parseInt(this.fullFormData.employeeType.employeeTypeID) : null,
            dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.fromDate),
            dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.toDate),
            RetirementDate: this.dataService.formatDateToISO(this.fullFormData.retirement),
            promotionEligible: Boolean(this.fullFormData.promotionEligible),
            PhotoID: parseInt(this.fullFormData.photoId.photoID) || null,
            employeeDocuments: documentData,
          }

          console.log("dataNEw", data)

          if (this.isEdited) {
            debugger
            const employeeId: number = Number(this.employeeId)
            this.dataService.updateTeacher(data, employeeId).subscribe(
              (response) => {
                debugger
                console.log('Employee Updated successfully:', response);
                if (response.status === 200) {
                  this.submitBtnStatus.personal = false;
                  this.submitBtnStatus.education = false;
                  this.submitBtnStatus.professional = false;


                  this.toastr.success('Teacher Updated !', 'Success', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });
                  this.router.navigate(['/non-teachers/non-teacher-list'])

                } else {

                  this.toastr.error('Teacher Update !', 'Failed', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });
                  this.currentStep = 1
                }

              },
              (error) => {
                if (error.status == 409) {
                  let message: string = error.error?.message
                  this.toastr.error(message + '!', 'Failed', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });
                  this.currentStep = 1
                  return;
                }

                this.toastr.error('Somthing Went Wrong !', 'Failed', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
                console.error(error);
                this.currentStep = 1
              }
            );

          } else {
            debugger
            this.dataService.addTeacher(data).subscribe(
              (response) => {
                debugger
                console.log('Employee added successfully:', response);
                if (response.status === 200) {
                  this.submitBtnStatus.personal = false;
                  this.submitBtnStatus.education = false;
                  this.submitBtnStatus.professional = false;

                  this.toastr.success('Teacher Added !', 'Success', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });

                  this.router.navigate(['non-teachers/non-teacher-list'])

                } else {


                  if (response.message) {
                    let message: string = response.message
                    this.toastr.error(message + '!', 'Failed', {
                      closeButton: true,
                      progressBar: true,
                      positionClass: 'toast-top-left',
                      timeOut: 4500,
                    });
                    return;
                  }

                  this.toastr.error('Teacher Add !', 'Failed', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });
                  this.currentStep = 1
                }

              },
              (error) => {
                if (error.status == 409) {
                  let message: string = error.error?.message
                  this.toastr.error(message + '!', 'Failed', {
                    closeButton: true,
                    progressBar: true,
                    positionClass: 'toast-top-left',
                    timeOut: 4500,
                  });
                  this.currentStep = 1
                  return;
                }
                debugger
                this.toastr.error('Somthing Went Wrong !', 'Failed', {
                  closeButton: true,
                  progressBar: true,
                  positionClass: 'toast-top-left',
                  timeOut: 4500,
                });
                console.error(error);
                this.currentStep = 1
              }
            );
          }

        })

        // })



      })






    } catch (error) {
      console.error('Error during previewSubmit:', error);
      this.toastr.error('Something went wrong during file upload!', 'Failed');
    }
  }

  // onSubmit(): void {
  //   let formData: any = {};
  //   debugger
  //   if (this.personalDetailsForm.valid) {
  //     const personalDetails = this.personalDetailsForm.value;
  //     const educationDetails = this.educationForm.value;
  //     const documentDetails = this.documentForm.value;
  //     const professionalDetails = this.professionalForm.value;
  //     if (personalDetails) {
  //       formData = {
  //         ...formData,
  //         ...personalDetails

  //       };
  //     }

  //     if (this.educationForm.valid) {
  //       formData.educations = educationDetails.educations
  //     }

  //     if (this.documentForm.valid  ) {
  //       formData.documents = documentDetails.documents
  //     }else{
  //       formData.documents = []
  //     }


  //     if (this.professionalForm.valid) {
  //       formData = {
  //         ...formData,
  //         ...professionalDetails

  //       };
  //     }

  //     this.fullFormData = formData

  //   }
  // }


  // uploadPhoto(teacherId: number, photo: File) {
  //   this.dataService.uploadPhoto(teacherId, photo).subscribe(response => {
  //     console.log(response);
  //   })
  // }

  onSubmit(): void {
    let formData: any = {};
    debugger;

    // Validate personal details
    if (this.personalDetailsForm.valid) {
      const personalDetails = this.personalDetailsForm.value;
      formData = { ...formData, ...personalDetails };
    }

    // Validate education details
    if (this.educationForm.valid) {
      const educationDetails = this.educationForm.value;
      formData.educations = educationDetails.educations;
    }

    // Process document details
    console.log("on submit", this.educationForm.value)


    formData.documents = this.documentForm.value.documents;
    // } else {
    //   formData.documents = [];
    // }

    // Validate professional details
    if (this.professionalForm.valid) {
      const professionalDetails = this.professionalForm.value;
      formData = { ...formData, ...professionalDetails };
    }

    // Assign and log the final data
    this.fullFormData = formData;
    console.log("formData", formData);
  }

  filterEmptyFields(obj: Record<string, any>): Record<string, any> {
    const filteredObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== null && value !== undefined && value !== "" && !Number.isNaN(value)) {
          filteredObj[key] = value;
        }
      }
    }
    return filteredObj;
  }


  FileChanged(data: any) {
    this.files = { ...this.files, ...data.files }
    console.log("DAAT f", this.files, data)
    this.previewUrl = data.previewUrl
    console.log("fileeES", this.files)
  }


  onCancel() {
    this.router.navigate(['/dashboard']);
  }
  editBtnClickFromPreview() {
    this.currentStep = 1
  }

}
