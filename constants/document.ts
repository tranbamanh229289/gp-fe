export enum DocumentType {
    CitizenIdentity = "citizen_identity",
    AcademicDegree = "academic_degree",
    HealthInsurance = "health_insurance",
    DriverLicense = "driver_license",
    Passport = "passport",
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export enum DocumentStatus {
    Active = "active",
    Revoked = "revoked",
    Expired = "expired",
}

export enum DegreeType {
    Bachelor = "bachelor",
    Master = "master",
    PhD = "phd",
    AssociateProfessor = "associate professor",
    FullProfessor = "full professor",
}

export enum DegreeClassification {
    Excellent = "excellent",
    VeryGood = "very_good",
    Good = "good",
    Average = "average",
    Pass = "pass",
}

export enum PassportType {
    Ordinary = "ordinary",
    Diplomatic = "diplomatic",
    Official = "official",
}

export const documentStatusConfig = {
    [DocumentStatus.Active]: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    [DocumentStatus.Revoked]: {
        color: "bg-red-100 text-red-700 border-red-300",
    },
    [DocumentStatus.Expired]: {
        color: "bg-rose-100 text-rose-700 border-rose-300",
    },
};

export const countriesList = [
    "Vietnam",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Netherland",
    "Spain",
    "Russia",
    "Poland",
    "Ukraine",
    "Switzerland",
    "Belgium",
    "Japan",
    "Korea",
    "China",
    "India",
    "Thailand",
    "Malaysia",
    "Indonesia",
    "Brazil",
    "Argentina",
    "Turkey",
    "Saudi Arabia",
    "Israel",
    "Iran",
    "UAE",
];

const provincesList = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bạc Liêu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Dương",
    "Bình Định",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Thành phố Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
];

const licenseClassesList = [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "C",
    "D",
    "E",
    "FB2",
    "FC",
    "FD",
    "FE",
];

const universityList = [
    "VNU",
    "HUST",
    "FTU",
    "NEU",
    "HNUE",
    "HANU",
    "HAU",
    "UET",
    "AOF",
    "VinUni",
];

const hospitalList = [
    "Bệnh viện Bạch Mai",
    "Bệnh viện Hữu nghị Việt Đức",
    "Bệnh viện Nhi Trung ương",
    "Bệnh viện Bệnh Nhiệt đới Trung ương",
    "Bệnh viện Đa khoa Xanh Pôn",
    "Bệnh viện Trung ương Quân đội 108",
    "Bệnh viện Quân y 103",
    "Bệnh viện K",
    "Bệnh viện Tim Hà Nội",
    "Bệnh viện Việt Pháp Hà Nội",
    "Bệnh viện Đa khoa Quốc tế Thu Cúc",
    "Bệnh viện Đa khoa Hồng Ngọc",
    "Bệnh viện Đa khoa MEDLATEC",
];
const healthInsuranceTypes = [
    "Người lao động",
    "Cán bộ, công chức, viên chức",
    "Hưởng lương hưu / trợ cấp BHXH",
    "Trẻ em dưới 6 tuổi",
    "Hộ nghèo / cận nghèo",
    "Người có công",
    "Học sinh, sinh viên",
    "Hộ gia đình",
];
export interface DocumentField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    max?: number;
    min?: number;
    options?: string[];
}

export const documentTypeFields: Record<DocumentType, DocumentField[]> = {
    [DocumentType.CitizenIdentity]: [
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
        },
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
            required: true,
        },

        {
            name: "dateOfBirth",
            label: "Date of Birth",
            type: "date",
            required: true,
        },

        {
            name: "placeOfBirth",
            label: "Place of Birth",
            type: "select",
            options: provincesList,
            required: true,
        },

        {
            name: "gender",
            label: "Gender",
            type: "select",
            options: Object.values(Gender),
            required: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: Object.values(DocumentStatus),
            required: true,
        },

        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
    [DocumentType.DriverLicense]: [
        {
            name: "class",
            label: "License Class",
            type: "select",
            options: licenseClassesList,
            required: true,
        },
        {
            name: "point",
            label: "Points",
            type: "number",
            max: 10,
            min: 0,
            required: true,
        },

        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],

    [DocumentType.AcademicDegree]: [
        {
            name: "degreeType",
            label: "Degree Type",
            type: "select",
            options: Object.values(DegreeType),
            required: true,
        },
        { name: "major", label: "Major", type: "text", required: true },
        {
            name: "university",
            label: "University",
            type: "select",
            options: universityList,
            required: true,
        },
        { name: "gpa", label: "GPA", type: "number", required: true },
        {
            name: "graduateYear",
            label: "Graduate Year",
            type: "number",
            required: true,
        },
        {
            name: "classification",
            label: "Classification",
            type: "select",
            options: Object.values(DegreeClassification),
            required: true,
        },
    ],

    [DocumentType.HealthInsurance]: [
        {
            name: "insuranceType",
            label: "Insurance Type",
            type: "select",
            options: healthInsuranceTypes,
            required: true,
        },
        {
            name: "hospital",
            label: "Hospital",
            type: "select",
            options: hospitalList,
            required: true,
        },

        {
            name: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
    [DocumentType.Passport]: [
        {
            name: "passportType",
            label: "Passport Type",
            type: "select",
            options: Object.values(PassportType),
            required: true,
        },
        {
            name: "nationality",
            label: "Nationality",
            type: "select",
            options: countriesList,
            required: true,
        },
        { name: "mrz", label: "MRZ", type: "text", required: true },
        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
};
