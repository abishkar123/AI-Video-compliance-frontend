import React from 'react';
import { useParams } from 'react-router-dom';
import AuditForm   from '../components/audit/AuditForm';
import AuditStatus from '../components/audit/AuditStatus';

export default function AuditPage() {
  const { sessionId } = useParams();
  return sessionId ? <AuditStatus /> : <AuditForm />;
}
