import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/service/data/data.service';
import { dateRangeValidator } from 'src/app/utils/validators/date-range-validator';

interface SubmitBtnStatus {
  personal: boolean, education: boolean, professional: boolean
}

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {
  isSidebarClosed = false;
  currentStep = 1;
  steps = ['Personal Details', 'Educational Details', 'Professional Details', 'Preview & Submit'];
  teacherRegister: boolean = true;
  personalDetailsForm!: FormGroup;
  educationForm!: FormGroup;
  professionalForm!: FormGroup;
  detailViewForm!: FormGroup;
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
  submitBtnStatus: SubmitBtnStatus = { personal: false, education: false, professional: false }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
  ) {
    this.personalDetailsForm = this.fb.group({
      permanentEmployeeNumber: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]*')]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      religion: ['', Validators.required],
      category: ['', Validators.required],
      caste: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      whetherDifferentlyAbled: ['', Validators.required],
      exServicemen: ['', Validators.required],
      identificationMarksOne: ['', Validators.maxLength(100)],
      identificationMarksTwo: ['', Validators.maxLength(100)],
      height: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      aadharId: ['', [Validators.required, Validators.pattern('[0-9]{12}')]],
      pan: ['', [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      rationCardNumber: ['', [Validators.required, Validators.maxLength(20)]],
      voterId: ['', [Validators.required, Validators.pattern('[A-Z]{3}[0-9]{7}')]],
      currentAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      permanentAddress: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      fathersName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      mothersName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      interReligion: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      spousesName: ['',],
      spousesReligion: ['',],
      spousesCaste: ['',],
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
      employeeType: ['', Validators.required],
      designation: ['', Validators.required],
      subject: ['', Validators.required],
      pfNumber: ['', [Validators.required, Validators.pattern('[A-Z]{2}[0-9]{7}')]],
      pran: ['', [Validators.required, Validators.pattern('[A-Z]{4}[0-9]{6}')]],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      retirement: ['', Validators.required],
      schoolName: ['', Validators.required],
      pCategory: ['', Validators.required],
      // schoolType: ['', Validators.required],
      // trained: ['', Validators.required],
      // trainingAttended: ['', Validators.required],
      eligibleTestQualified: ['', Validators.required],
      approvalType: ['', Validators.required],
      protectedTeacher: ['', Validators.required]
    },
      //  { validators: dateRangeValidator('startDate', 'endDate') }
    );

    this.educationForm = this.fb.group({
      educations: this.fb.array([]) // Initialize as empty array

    });

    // this function invoke when change married field 
    this.onMaritalStatusChange()
    this.onCourseNameSelectOtherToAddValidation()
    this.checkEducationTypeToSetEligibilityTest()

  }

  ngOnInit() {
    this.loadAllData();
    const coursesArray = this.educationForm.get('educations') as FormArray;
    if (coursesArray.length === 0) {
      this.addCourse();
    }
  }

  checkEducationTypeToSetEligibilityTest() {
    debugger
    this.educationForm.get('educations')?.valueChanges.subscribe(educationArray => {
      debugger

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
    debugger
    this.personalDetailsForm.get('maritalStatus')?.valueChanges.subscribe((status) => {
      debugger
      if (status.maritalStatusID == '2') {
        // Add Validators.required to spouse-related fields
        this.personalDetailsForm.get('spousesName')?.setValidators([Validators.required]);
        this.personalDetailsForm.get('spousesReligion')?.setValidators([Validators.required]);
        this.personalDetailsForm.get('spousesCaste')?.setValidators([Validators.required]);
      } else {
        // Clear Validators for spouse-related fields if not married
        this.personalDetailsForm.get('spousesName')?.clearValidators();
        this.personalDetailsForm.get('spousesReligion')?.clearValidators();
        this.personalDetailsForm.get('spousesCaste')?.clearValidators();
      }

      // Update validation status after modifying validators
      this.personalDetailsForm.get('spousesName')?.updateValueAndValidity();
      this.personalDetailsForm.get('spousesReligion')?.updateValueAndValidity();
      this.personalDetailsForm.get('spousesCaste')?.updateValueAndValidity();
    });
  }

  onCourseNameSelectOtherToAddValidation(): void {
    debugger
    this.educationForm.get('educations')?.valueChanges.subscribe(educationArray => {
      debugger
      const educations = this.educationForm.get('educations') as FormArray;
    
      educationArray.forEach((education: any, index: number) => {
        debugger
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
    
        // Recalculate validation status
        courseNameOtherControl?.updateValueAndValidity();
      });
    });
  }


  loadAllData(): void {
    this.dataService.getAllSubjects().subscribe(data => {
      this.subjects = data;
      console.log('Subjects:', this.subjects);
    });
    this.dataService.getAllStatuses().subscribe(data => {
      this.statuses = data;
      console.log('Statuses:', this.statuses);
    });
    this.dataService.getAllSchools().subscribe(data => {
      this.schools = data;
      console.log('Schools:', this.schools);
    });
    this.dataService.getAllReligions().subscribe(data => {
      this.religions = data;
      console.log('Religions:', this.religions);
    });
    this.dataService.getAllMaritalStatuses().subscribe(data => {
      this.maritalStatuses = data;
      console.log('Marital Statuses:', this.maritalStatuses);
    });
    this.dataService.getAllGenders().subscribe(data => {
      this.genders = data;
      console.log('Genders:', this.genders);
    });
    this.dataService.getAllEmployeeTypes().subscribe(data => {
      this.employeeTypes = data;
      console.log('Employee Types:', this.employeeTypes);
    });
    this.dataService.getAllDesignations().subscribe(data => {
      this.designationsList = data;
      console.log('Designation:', this.employeeTypes);
    });
    this.dataService.getAllEmployeeCategories().subscribe(data => {
      this.employeeCategories = data;
      console.log('Employee Categories:', this.employeeCategories);
    });
    this.dataService.getSchoolWithCity().subscribe(data => {
      this.schoolNameWithCity = data;
      console.log('Schoolname with city:', this.schoolNameWithCity);
    });
    this.dataService.getAllDistricts().subscribe(data => {
      this.districts = data;
      console.log('Districts:', this.districts);
    });
    this.dataService.getAllCourses().subscribe(data => {
      this.allEducationTypes = data;
      console.log('All Education Types:', this.allEducationTypes);
    });
    if (this.educationTypeId) {
      this.dataService.getCoursesByEducationType(this.educationTypeId).subscribe(data => {
        this.coursesByEducation = data;
        console.log('Courses by Education:', this.coursesByEducation);
      });
    }
    this.dataService.getAllCities().subscribe(data => {
      this.cities = data;
      console.log('Cities:', this.cities);
    });
    this.dataService.getAllCasteCategories().subscribe(data => {
      this.casteCategories = data;
      console.log('Caste Categories:', this.casteCategories);
    });
    this.dataService.getAllBloodGroups().subscribe(data => {
      this.bloodGroups = data;
      console.log('Blood Groups:', this.bloodGroups);
    });
    this.dataService.getAllApprovalTypes().subscribe(data => {
      this.approvalTypes = data;
      console.log('Approval Types:', this.approvalTypes);
    });
  }

  addCourse() {
    const courseGroup = this.fb.group({
      educationType: ['', Validators.required],
      courseName: ['', Validators.required],
      courseNameOther: [''],
      schoolName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      certificate: ['']
    }, { validators: dateRangeValidator('fromDate', 'toDate') });
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
  //       break;
  //     case 2:
  //       currentForm = this.educationForm;
  //       break;
  //     case 3:
  //       currentForm = this.professionalForm;
  //       break;
  //     default:
  //       currentForm = this.detailViewForm;
  //       break;
  //   }
  //   if (currentForm) {
  //     if (this.currentStep < this.steps.length) {
  //       this.currentStep++;
  //       this.onSubmit();
  //     } else {
  //       this.onSubmit();
  //       console.log('step execute');
  //     }
  //   } else {
  //     console.log('Form is invalid. Please check your inputs.');
  //   }
  // }

  saveAndContinue() {
    debugger
    let currentForm: FormGroup;

    switch (this.currentStep) {
      case 1:
        currentForm = this.personalDetailsForm;
        this.submitBtnStatus.personal = true
        break;
      case 2:
        currentForm = this.educationForm;
        this.submitBtnStatus.education = true
        break;
      case 3:
        currentForm = this.professionalForm;
        this.submitBtnStatus.professional = true
        break;
      default:
        currentForm = this.professionalForm;
        break;
    }

    if (currentForm.valid) {
      if (this.currentStep <= this.steps.length) {
        this.currentStep++;

        if (this.currentStep === this.steps.length) {
          this.onSubmit(); // Collect form data for preview
        }
        if (this, this.currentStep === this.steps.length + 1) {
          this.previewSubmit()
        }
      }

    } else {
      console.log('Form is invalid. Please check your inputs.');
    }

  }

  previewSubmit() {
    let educationData = this.fullFormData.educations.map((edu: any) => ({
      educationTypeID: parseInt(edu.educationType.educationTypeID),
      courseID: parseInt(edu.courseName.courseID),
      courseName: edu.courseNameOther,
      schoolName: edu.schoolName,
      fromDate: this.dataService.formatDateToISO(edu.fromDate),
      toDate: this.dataService.formatDateToISO(edu.toDate),
      DocumentID: parseInt(edu.certificate?.documentID) || ""
    }));

    let data = {
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
      rationID: this.fullFormData.rationCardNumber,
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
      // dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.dateOfJoin),
      // dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.dateOfJoinDepartment),
      categoryID: parseInt(this.fullFormData.pCategory.employeeCategoryId),
      // schoolTypeID: parseInt(this.fullFormData.schoolTypeID),
      // fromDate: this.dataService.formatDateToISO(this.fullFormData.fromDate),
      // toDate: this.dataService.formatDateToISO(this.fullFormData.toDate),
      documentID: parseInt(this.fullFormData.documentID),
      EligibilityTestQualified: Boolean(this.fullFormData.eligibilityTestQualified),
      ProtectedTeacher: Boolean(this.fullFormData.protectedTeacher),
      // trainingAttended: Boolean(this.fullFormData.trainingAttended),
      designationID: this.fullFormData.designation ? parseInt(this.fullFormData.designation.designationID) : null,
      subjectID: parseInt(this.fullFormData.subject.subjectID),
      employeeTypeID: this.fullFormData.employeeType ? parseInt(this.fullFormData.employeeType.employeeTypeID) : null,
      dateOfJoin: this.dataService.formatDateToISO(this.fullFormData.fromDate),
      dateOfJoinDepartment: this.dataService.formatDateToISO(this.fullFormData.toDate),
      RetirementDate: this.dataService.formatDateToISO(this.fullFormData.retirement),
      promotionEligible: Boolean(this.fullFormData.promotionEligible),
      PhotoID: parseInt(this.fullFormData.photoId.photoID),
    }



    this.dataService.addTeacher(data).subscribe(
      (response) => {
        console.log('Employee added successfully:', response);
        if (response.employeeID) {
          this.submitBtnStatus.personal = false;
          this.submitBtnStatus.education = false;
          this.submitBtnStatus.professional = false;
          console.log(response.employeeID);
          this.router.navigate(['/teachers/teacher-list'])

        }

      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit(): void {
    let formData: any = {};
    debugger
    if (this.personalDetailsForm.valid) {
      const personalDetails = this.personalDetailsForm.value;
      const educationDetails = this.educationForm.value;
      const professionalDetails = this.professionalForm.value;
      if (personalDetails) {
        formData = {
          ...formData,
          ...personalDetails
          // pen: personalDetails.permanentEmployeeNumber ? personalDetails.permanentEmployeeNumber : "",
          // firstName: personalDetails.firstName ? personalDetails.firstName : "",
          // lastName: personalDetails.lastName ? personalDetails.lastName : "",
          // email: personalDetails.email ? personalDetails.email : "",
          // phone: personalDetails.phone ? personalDetails.phone : "",
          // presentAddress: personalDetails.currentAddress ? personalDetails.currentAddress : "",
          // permanentAddress: personalDetails.permanentAddress ? personalDetails.permanentAddress : "",
          // dateOfBirth: this.dataService.formatDateToISO(personalDetails.dob),
          // sexID: parseInt(personalDetails.sex),
          // religionID: parseInt(personalDetails.religion),
          // casteID: parseInt(personalDetails.category),
          // caste: personalDetails.caste ? personalDetails.caste : "",
          // bloodGroupID: parseInt(personalDetails.bloodGroup),
          // rationID: personalDetails.rationCardNumber,
          // differentlyAbled: Boolean(personalDetails.whetherDifferentlyAbled),
          // exServiceMen: Boolean(personalDetails.exServicemen),
          // aadhaarID: personalDetails.aadharId ? personalDetails.aadharId : "",
          // identificationMark1: personalDetails.identificationMarksOne ? personalDetails.identificationMarksOne : "",
          // identificationMark2: personalDetails.identificationMarksTwo ? personalDetails.identificationMarksTwo : "",
          // height: personalDetails.height ? personalDetails.height : "",
          // fatherName: personalDetails.fathersName ? personalDetails.fathersName : "",
          // motherName: personalDetails.mothersName ? personalDetails.mothersName : "",
          // interReligion: Boolean(personalDetails.interReligion),
          // maritalStatusID: parseInt(personalDetails.maritalStatus),
          // spouseName: personalDetails.spousesName ? personalDetails.spousesName : "",
          // spouseReligion: parseInt(personalDetails.spousesReligion),
          // statusID: 1,
          // spouseCaste: personalDetails.spousesCaste ? personalDetails.spousesCaste : "",
          // panID: personalDetails.pan,
          // voterID: personalDetails.voterId ? personalDetails.voterId : "",
          // educations: null,
          // departmentID: null,
          // districtID: null,
          // pfNummber: null,
          // pran: null,
          // dateOfJoin: null,
          // dateOfJoinDepartment: null,
          // categoryID: null,
          // schoolTypeID: null,
          // fromDate: null,
          // toDate: null,
          // documentID: null,
          // eligibilityTestQualified: null,
          // trainingAttended: null,
          // designationID: null,
          // subjectID: null,
          // employeeTypeID: null,
          // hireDate: null,
          // workStartDate: null,
          // retireDate: null,
          // promotionEligible: null
        };
      }

      if (this.educationForm.valid) {
        // formData.educations = educationDetails.educations.map((edu: any) => ({
        //   educationTypeID: parseInt(edu.educationType.courseID),
        //   courseID: parseInt(edu.courseName.courseID),
        //   schoolName: edu.schoolName,
        //   fromDate: this.dataService.formatDateToISO(edu.fromDate),
        //   toDate: this.dataService.formatDateToISO(edu.toDate),
        //   certificate: edu.certificate || ""
        // }));
        formData.educations = educationDetails.educations

      }
      console.log("after sec", formData)

      if (this.professionalForm.valid) {
        formData = {
          ...formData,
          ...professionalDetails
          // departmentID: parseInt(professionalDetails.department.employeeTypeID),
          // districtID: parseInt(professionalDetails.district.districtID),
          // pfNummber: professionalDetails.pfNumber,
          // pran: professionalDetails.pran,
          // dateOfJoin: this.dataService.formatDateToISO(professionalDetails.dateOfJoin),
          // dateOfJoinDepartment: this.dataService.formatDateToISO(professionalDetails.dateOfJoinDepartment),
          // categoryID: parseInt(professionalDetails.categoryID),
          // schoolTypeID: parseInt(professionalDetails.schoolTypeID),
          // fromDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
          // toDate: this.dataService.formatDateToISO(professionalDetails.toDate),
          // documentID: parseInt(professionalDetails.documentID),
          // eligibilityTestQualified: Boolean(professionalDetails.eligibilityTestQualified),
          // trainingAttended: Boolean(professionalDetails.trainingAttended),
          // designationID: professionalDetails.designation ? parseInt(professionalDetails.designation.designationID) : null,
          // subjectID: parseInt(professionalDetails.subject.subjectID),
          // employeeTypeID: professionalDetails.employeeType ? parseInt(professionalDetails.employeeType.employeeTypeID) : null,
          // hireDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
          // workStartDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
          // retireDate: this.dataService.formatDateToISO(professionalDetails.toDate),
          // promotionEligible: Boolean(professionalDetails.promotionEligible),
        };

        // this.dataService.addTeacher(formData).subscribe(
        //   (response) => {
        //     console.log('Employee added successfully:', response);
        //     if (response.employeeID) {
        //       console.log(response.employeeID);

        //     }

        //   },
        //   (error) => {
        //     console.error(error);
        //   }
        // );

      }

      this.fullFormData = formData

    }
  }


  uploadPhoto(teacherId: number, photo: File) {
    this.dataService.uploadPhoto(teacherId, photo).subscribe(response => {
      console.log(response);
    })
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

  // onSubmit(): void {
  //   let formData: any = {};
  //   debugger
  //   if (this.personalDetailsForm) {
  //     const personalDetails = this.personalDetailsForm.value;
  //     const educationDetails = this.educationForm.value;
  //     const professionalDetails = this.professionalForm.value;
  //     if (personalDetails) {
  //       formData = {
  //         ...formData,
  //         pen: personalDetails.permanentEmployeeNumber ? personalDetails.permanentEmployeeNumber : "",
  //         firstName: personalDetails.firstName ? personalDetails.firstName : "",
  //         lastName: personalDetails.lastName ? personalDetails.lastName : "",
  //         email: personalDetails.email ? personalDetails.email : "",
  //         phone: personalDetails.phone ? personalDetails.phone : "",
  //         presentAddress: personalDetails.currentAddress ? personalDetails.currentAddress : "",
  //         permanentAddress: personalDetails.permanentAddress ? personalDetails.permanentAddress : "",
  //         dateOfBirth: this.dataService.formatDateToISO(personalDetails.dob),
  //         sexID: parseInt(personalDetails.sex),
  //         religionID: parseInt(personalDetails.religion),
  //         casteID: parseInt(personalDetails.category),
  //         caste: personalDetails.caste ? personalDetails.caste : "",
  //         bloodGroupID: parseInt(personalDetails.bloodGroup),
  //         rationID: personalDetails.rationCardNumber,
  //         differentlyAbled: Boolean(personalDetails.whetherDifferentlyAbled),
  //         exServiceMen: Boolean(personalDetails.exServicemen),
  //         aadhaarID: personalDetails.aadharId ? personalDetails.aadharId : "",
  //         identificationMark1: personalDetails.identificationMarksOne ? personalDetails.identificationMarksOne : "",
  //         identificationMark2: personalDetails.identificationMarksTwo ? personalDetails.identificationMarksTwo : "",
  //         height: personalDetails.height ? personalDetails.height : "",
  //         fatherName: personalDetails.fathersName ? personalDetails.fathersName : "",
  //         motherName: personalDetails.mothersName ? personalDetails.mothersName : "",
  //         interReligion: Boolean(personalDetails.interReligion),
  //         maritalStatusID: parseInt(personalDetails.maritalStatus),
  //         spouseName: personalDetails.spousesName ? personalDetails.spousesName : "",
  //         spouseReligion: parseInt(personalDetails.spousesReligion),
  //         statusID: 1,
  //         spouseCaste: personalDetails.spousesCaste ? personalDetails.spousesCaste : "",
  //         panID: personalDetails.pan,
  //         voterID: personalDetails.voterId ? personalDetails.voterId : "",
  //         educations: null,
  //         departmentID: null,
  //         districtID: null,
  //         pfNummber: null,
  //         pran: null,
  //         dateOfJoin: null,
  //         dateOfJoinDepartment: null,
  //         categoryID: null,
  //         schoolTypeID: null,
  //         fromDate: null,
  //         toDate: null,
  //         documentID: null,
  //         eligibilityTestQualified: null,
  //         trainingAttended: null,
  //         designationID: null,
  //         subjectID: null,
  //         employeeTypeID: null,
  //         hireDate: null,
  //         workStartDate: null,
  //         retireDate: null,
  //         promotionEligible: null
  //       };
  //     }

  //     if (this.educationForm.valid) {
  //       formData.educations = educationDetails.educations.map((edu: any) => ({
  //         educationType: parseInt(edu.educationType),
  //         courseName: edu.courseName,
  //         schoolName: edu.schoolName,
  //         fromDate: this.dataService.formatDateToISO(edu.fromDate),
  //         toDate: this.dataService.formatDateToISO(edu.toDate),
  //         certificate: edu.certificate || ""
  //       }));
  //     }
  //     console.log("after sec", formData)

  //     if (this.professionalForm.valid) {
  //       formData = {
  //         ...formData,
  //         departmentID: parseInt(professionalDetails.department),
  //         districtID: parseInt(professionalDetails.district),
  //         pfNummber: professionalDetails.pfNumber,
  //         pran: professionalDetails.pran,
  //         dateOfJoin: this.dataService.formatDateToISO(professionalDetails.dateOfJoin),
  //         dateOfJoinDepartment: this.dataService.formatDateToISO(professionalDetails.dateOfJoinDepartment),
  //         categoryID: parseInt(professionalDetails.categoryID),
  //         schoolTypeID: parseInt(professionalDetails.schoolTypeID),
  //         fromDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
  //         toDate: this.dataService.formatDateToISO(professionalDetails.toDate),
  //         documentID: parseInt(professionalDetails.documentID),
  //         eligibilityTestQualified: Boolean(professionalDetails.eligibilityTestQualified),
  //         trainingAttended: Boolean(professionalDetails.trainingAttended),
  //         designationID: professionalDetails.designation ? parseInt(professionalDetails.designation) : null,
  //         subjectID: parseInt(professionalDetails.subject),
  //         employeeTypeID: professionalDetails.employeeType ? parseInt(professionalDetails.employeeType) : null,
  //         hireDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
  //         workStartDate: this.dataService.formatDateToISO(professionalDetails.fromDate),
  //         retireDate: this.dataService.formatDateToISO(professionalDetails.toDate),
  //         promotionEligible: Boolean(professionalDetails.promotionEligible),
  //       };

  //       // this.dataService.addTeacher(formData).subscribe(
  //       //   (response) => {
  //       //     console.log('Employee added successfully:', response);
  //       //     if (response.employeeID) {
  //       //       console.log(response.employeeID);

  //       //     }

  //       //   },
  //       //   (error) => {
  //       //     console.error(error);
  //       //   }
  //       // );

  //     }
  //     console.log('formData:', formData);

  //   }
  // }

  onCancel() {
    this.router.navigate(['teachers/teacher-list']);
  }
  editBtnClickFromPreview() {
    this.currentStep = 1
  }
}
