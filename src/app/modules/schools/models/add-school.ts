export interface SchoolData {
    schoolName: string
    addSchoolTypes?: any;              
    updateSchoolTypes?: any; 
    address: string
    cityID: number
    state: string
    pincode: string
    email: string
    phone: string
    photoID?: any
    statusID?: number
    principalID?: number |null
    vicePrincipalID?: number |null
    addDivisions?:any
}
