/**
 * Shared type definitions for the ComplianceQA Frontend
 */

export interface ComplianceResult {
    category: string;
    severity: 'CRITICAL' | 'WARNING';
    description: string;
}

export interface VideoMetadata {
    duration: number | null;
    platform: string;
}

export interface AuditJob {
    sessionId: string;
    videoUrl: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    stage: string | null;
    progress: number;
    error: string | null;
    createdAt: string;
    updatedAt: string;
    finalStatus?: 'PASS' | 'FAIL';
    finalReport?: string;
    complianceResults?: ComplianceResult[];
    videoId?: string;
    transcript?: string;
    ocrText?: string[];
    videoMetadata?: VideoMetadata;
    graphRunId?: string;
}

export interface NodeTrace {
    nodeId: string;
    label: string;
    description: string;
    icon: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    error: string | null;
    stateSnapshot: Record<string, unknown> | null;
}

export interface GraphRunTrace {
    runId: string;
    graphName: string;
    status: 'running' | 'completed' | 'failed';
    finalStatus?: string;
    videoUrl: string;
    videoId: string;
    startedAt: string;
    completedAt: string | null;
    durationMs: number | null;
    nodeCount?: number;
    nodes: NodeTrace[];
}

export interface GraphStats {
    total: number;
    passed: number;
    failed: number;
    avgMs: number;
    nodeAverages: Array<{
        nodeId: string;
        avgMs: number;
        failureRate: number;
    }>;
}

export interface GraphDefinition {
    name: string;
    entryPoint: string;
    nodes: Array<{
        id: string;
        label: string;
        description: string;
        icon: string;
    }>;
    edges: Array<{ from: string; to: string }>;
}
