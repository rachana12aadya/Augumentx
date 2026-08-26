import type { DemoUser } from '@/types';

export const demoUsers: DemoUser[] = [
  { name: 'Sarah Chen', email: 'sarah@demo.com', role: 'individual', status: 'Active', lastActive: '2 hours ago', assessments: 2 },
  { name: 'Marcus Williams', email: 'marcus@demo.com', role: 'individual', status: 'Active', lastActive: '1 day ago', assessments: 1 },
  { name: 'Elena Rodriguez', email: 'elena@demo.com', role: 'individual', status: 'Inactive', lastActive: '2 weeks ago', assessments: 3 },
  { name: 'James Thompson', email: 'james@demo.com', role: 'individual', status: 'Active', lastActive: '5 hours ago', assessments: 1 },
  { name: 'Aisha Patel', email: 'aisha@demo.com', role: 'professional', status: 'Active', lastActive: '1 hour ago', assessments: 15 },
  { name: 'Dr. Robert Kim', email: 'robert@demo.com', role: 'professional', status: 'Active', lastActive: '3 hours ago', assessments: 28 },
  { name: 'Pacific MedTech Co.', email: 'pacific@demo.com', role: 'provider', status: 'Active', lastActive: '1 day ago', assessments: 0 },
  { name: 'NovaCare Solutions', email: 'novacare@demo.com', role: 'provider', status: 'Active', lastActive: '3 days ago', assessments: 0 },
];

export const testAccounts = [
  { email: 'alex@augmentx.demo', password: 'demo123', name: 'Alex Morgan', role: 'individual' as const },
  { email: 'doctor@augmentx.demo', password: 'demo123', name: 'Dr. Sarah Blake', role: 'professional' as const },
  { email: 'provider@augmentx.demo', password: 'demo123', name: 'TechCare Inc.', role: 'provider' as const },
  { email: 'admin@augmentx.demo', password: 'demo123', name: 'System Admin', role: 'admin' as const },
];
