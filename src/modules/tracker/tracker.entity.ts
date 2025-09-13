export type ApplicationStatus =
  | 'Applied'
  | 'Screening'
  | 'Interview HR'
  | 'Interview User'
  | 'Technical Test'
  | 'Offer'
  | 'Rejected';

export interface JobApplication {
  id: string;
  company_name: string;
  job_title: string;
  application_date: Date;
  status: ApplicationStatus;
  platform?: string | null;
  notes?: string | null;
  user_id: string;
}