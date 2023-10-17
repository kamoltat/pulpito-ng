export type QueryKey = [
  string,
  {
    url: string;
  }
];

export interface GetURLParams {
  [key: string]: string | number | null | undefined;
}

type RunParams = {
  name: string;
};

type NodeParams = {
  name: string;
};

export type Job = {
  id?: string;
  job_id: number;
  name: string;
  suite: string;
  branch: string;
  scheduled: string;
};

export type RunResults = {
  [key: string]: number | string;
}

export type Run = {
  name: string;
  branch: string;
  suite: string;
  jobs: Job[];
  scheduled: string;
  results: RunResults;
};

export type Node = {
  name: string;
  description: string | null;
  up: boolean;
  locked: boolean;
  os_type: string;
  os_version: string;
  arch: string | null;
  locked_since: string | null;
  locked_by: string | null;
  machine_type: string;
};

export type NodeJobs = {
  jobs?: Job[];
}

export type StatsLocksResponse = {
  id: string;
  owner: string;
  machine_type: string;
  count: number;
}

export interface StatsJobsResponse {
  id: string;
  name: string;
  pass?: number;
  fail?: number;
  dead?: number;
  unknown?: number;
  running?: number;
  total: number;
}
