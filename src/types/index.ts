export type Role =
  | 'SUPER_ADMIN'
  | 'PROPERTY_MANAGER'
  | 'ACCOUNTANT'
  | 'SECURITY_GUARD'
  | 'MAINTENANCE_STAFF'
  | 'TENANT';

export type FlatStatus = 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export type TenantStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'INACTIVE';

export type TenancyStatus =
  | 'ACTIVE'
  | 'UPCOMING'
  | 'EXPIRED'
  | 'NOTICE_PERIOD'
  | 'TERMINATED'
  | 'COMPLETED';

export type VisitorStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'UNAUTHORIZED';

export type PenaltyStatus =
  | 'REPORTED'
  | 'UNDER_REVIEW'
  | 'CONFIRMED'
  | 'APPLIED'
  | 'PAID'
  | 'WAIVED'
  | 'CANCELLED';

export type BillType =
  | 'RENT'
  | 'MAINTENANCE'
  | 'ELECTRICITY'
  | 'WATER'
  | 'PARKING'
  | 'PENALTY'
  | 'REPAIR'
  | 'OTHER';

export type InvoiceStatus =
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type PaymentMethod =
  | 'ONLINE_GATEWAY'
  | 'UPI'
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'MANUAL_ADJUSTMENT';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export type MaintenanceCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'CARPENTRY'
  | 'CLEANING'
  | 'APPLIANCE'
  | 'SECURITY'
  | 'CIVIL'
  | 'OTHER';

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type MaintenanceStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'RESOLVED'
  | 'CLOSED';

export type VehicleType = 'CAR' | 'BIKE' | 'SCOOTER' | 'OTHER';

export type ParkingStatus =
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'RESERVED'
  | 'MAINTENANCE';

export type NoticeCategory =
  | 'GENERAL'
  | 'SECURITY'
  | 'MAINTENANCE'
  | 'RENT'
  | 'EMERGENCY'
  | 'INDIVIDUAL';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
