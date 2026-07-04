export type TenantStatus = "active" | "provisioning" | "suspended";

export interface Tenant {
  id: string;
  code: string;
  name: string;
  sector: string;
  status: TenantStatus;
  region: string;
  provisionedOn: string;
  modulesEnabled: number;
  activeEngagements: number;
  healthScore: number;
}

export type EngagementStatus =
  | "scoping"
  | "active"
  | "evidence_review"
  | "qa"
  | "closed";

export interface Engagement {
  id: string;
  tenantId: string;
  name: string;
  client: string;
  lead: string;
  status: EngagementStatus;
  domain: string;
  opened: string;
  dueDate: string;
  evidenceCount: number;
  riskLevel: "low" | "medium" | "high";
}

export interface EvidenceItem {
  id: string;
  engagementId: string;
  title: string;
  type: "document" | "dataset" | "interview" | "audit" | "policy";
  source: string;
  ingested: string;
  classification: "internal" | "confidential" | "restricted";
  sizeKb: number;
}

export interface IntelligenceSignal {
  id: string;
  title: string;
  category: "risk" | "opportunity" | "compliance" | "trend";
  tenant: string;
  confidence: number;
  summary: string;
  detected: string;
  severity: "info" | "watch" | "elevated";
}

export interface Dataset {
  id: string;
  name: string;
  domain: string;
  rows: number;
  refreshCadence: string;
  lastSync: string;
  quality: number;
  sensitivity: "internal" | "confidential" | "restricted";
}

export interface KnowledgeArtifact {
  id: string;
  title: string;
  type: "framework" | "template" | "playbook" | "standard" | "precedent";
  domain: string;
  version: string;
  updated: string;
  usageCount: number;
}

export interface QAReview {
  id: string;
  subject: string;
  engagementId: string;
  reviewer: string;
  status: "pending" | "in_review" | "passed" | "flagged";
  submitted: string;
  standard: string;
  score: number | null;
}

export interface ProductApp {
  id: string;
  code: string;
  name: string;
  domain: string;
  description: string;
  tenantsUsing: number;
  status: "ga" | "beta" | "planned";
}
