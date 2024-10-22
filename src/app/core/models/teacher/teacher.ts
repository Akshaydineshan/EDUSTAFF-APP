export interface TeacherDocument {
    documentCount: number;
    error: any;
}

export interface Teacher {
    teacherId: number;
    name: string;
    schoolId: number | null;
    schoolName: string;
    designation: string;
    employeeType: string;
    subject: string;
    experienceYear: number;
    age: number;
    phoneNumber: string;
    documentCount: number;
    error: boolean;
    documentStatus: DocumentStatus;
}

export interface DocumentStatus {
    icon: string;
    text: string | number;
}

export interface TransferRequest {
    teacherId?: any;
    school: string;
    position: string;
    date: string;
    comment?: string;
}