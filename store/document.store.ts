import { DocumentStatus, DocumentType } from "@/constants/document";
import axiosInstance from "@/lib/axios";
import {
    AcademicDegree,
    CitizenIdentity,
    DocumentData,
    DriverLicense,
    HealthInsurance,
    Passport,
} from "@/types/document";
import { create } from "zustand";

const endpoints = {
    [DocumentType.CitizenIdentity]: "/documents/citizen_identity",
    [DocumentType.AcademicDegree]: "/documents/academic_degree",
    [DocumentType.HealthInsurance]: "/documents/health_insurance",
    [DocumentType.DriverLicense]: "/documents/driver_license",
    [DocumentType.Passport]: "/documents/passport",
};

interface DocumentStore {
    documents: {
        [DocumentType.CitizenIdentity]: CitizenIdentity[];
        [DocumentType.HealthInsurance]: HealthInsurance[];
        [DocumentType.AcademicDegree]: AcademicDegree[];
        [DocumentType.DriverLicense]: DriverLicense[];
        [DocumentType.Passport]: Passport[];
    };

    loading: boolean;
    error: string;

    getAll: (type: DocumentType) => Promise<void>;
    create: (type: DocumentType, data: Partial<DocumentData>) => Promise<void>;
    update: (
        type: DocumentType,
        id: string,
        data: Partial<DocumentData>,
    ) => Promise<void>;
    remove: (
        type: DocumentType,
        id: string,
        status: DocumentStatus,
    ) => Promise<void>;
    fetchDocumentByHolderDID: (
        type: DocumentType,
        holderDID: string,
    ) => Promise<DocumentData>;

    total: () => number;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
    documents: {
        [DocumentType.CitizenIdentity]: [],
        [DocumentType.HealthInsurance]: [],
        [DocumentType.AcademicDegree]: [],
        [DocumentType.DriverLicense]: [],
        [DocumentType.Passport]: [],
    },

    loading: false,
    error: "",

    getAll: async (type: DocumentType) => {
        set({ loading: true });
        try {
            const endpoint = endpoints[type];
            if (!endpoint) throw new Error("Invalid document type");

            const res = await axiosInstance.get<{
                data: DocumentData[] | [];
            }>(endpoint);

            set((state) => {
                return {
                    ...state,
                    documents: {
                        ...state.documents,
                        [type]: res.data.data ?? [],
                    },
                };
            });
        } catch (err) {
            set({ error: "fetch_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchDocumentByHolderDID: async (type: DocumentType, holderDID: string) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get<{
                data: DocumentData;
            }>(`documents/${holderDID}`, { params: { documentType: type } });

            return res.data.data;
        } catch (err) {
            set({ error: "fetch_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    create: async (type: DocumentType, data: Partial<DocumentData>) => {
        set({ loading: true });
        try {
            const endpoint = endpoints[type];
            if (!endpoint) throw new Error("Invalid document type");

            const res = await axiosInstance.post<{ data: DocumentData | null }>(
                endpoint,
                data,
            );
            set((state) => {
                const data = state.documents[type] ?? [];
                return {
                    ...state,
                    documents: {
                        ...state.documents,
                        [type]: res.data.data ? [...data, res.data.data] : data,
                    },
                };
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (err) {
            set({ error: "create_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    update: async (
        type: DocumentType,
        id: string,
        data: Partial<DocumentData>,
    ) => {
        set({ loading: true });
        try {
            const endpoint = endpoints[type];
            if (!endpoint) throw new Error("Invalid document type");

            const res = await axiosInstance.put<{ data: DocumentData | null }>(
                `${endpoint}/${id}`,
                data,
            );
            set((state) => {
                const data = state.documents[type] ?? [];
                const newData = data.map((item) => {
                    if (item.id !== id) {
                        return item;
                    }
                    return res.data.data ?? item;
                });
                return {
                    ...state,
                    documents: {
                        ...state.documents,
                        [type]: newData,
                    },
                };
            });
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (err) {
            set({ error: "update_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    remove: async (type: DocumentType, id: string, status: DocumentStatus) => {
        set({ loading: true });
        try {
            const endpoint = endpoints[type];
            if (!endpoint) throw new Error("Invalid document type");

            await axiosInstance.patch(`${endpoint}/${id}`, {
                status,
            });
            set((state) => {
                const data = state.documents[type] ?? [];
                const newData = data.map((item) => {
                    if (item.id !== id) {
                        return item;
                    } else {
                        return { ...item, status: status };
                    }
                });
                return {
                    ...state,
                    documents: {
                        ...state.documents,
                        [type]: newData,
                    },
                };
            });
        } catch (err) {
            set({ error: "delete_err" });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    total: () => {
        const documents = get().documents;
        const citizenIdentityLength =
            documents[DocumentType.CitizenIdentity as keyof typeof documents]
                .length;
        const academicDegreeLength =
            documents[DocumentType.AcademicDegree as keyof typeof documents]
                .length;
        const healthInsuranceLength =
            documents[DocumentType.HealthInsurance as keyof typeof documents]
                .length;
        const driverLicenseLength =
            documents[DocumentType.DriverLicense as keyof typeof documents]
                .length;
        const passportLength =
            documents[DocumentType.Passport as keyof typeof documents].length;
        return (
            citizenIdentityLength +
            academicDegreeLength +
            healthInsuranceLength +
            driverLicenseLength +
            passportLength
        );
    },
}));
