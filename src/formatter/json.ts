import { ProjectInfo } from '../analyzer/index.js';

export function formatJson(info: ProjectInfo): string {
  return JSON.stringify(
    {
      project: info.name,
      type: info.type,
      framework: info.framework,
      dependencies: info.dependencies,
      git: info.gitInfo
        ? { branch: info.gitInfo.branch }
        : null,
      structure: info.structure.children?.map(c => c.name) ?? [],
      configFiles: info.configFiles.map(c => ({
        path: c.path,
        type: c.type,
      })),
      keyFiles: info.keyFiles.slice(0, 5).map(f => ({
        path: f.path,
        size: f.size,
        modified: f.modified.toISOString(),
      })),
    },
    null,
    2
  );
}
