import { OccurenceModel } from './occurence.model';

export interface FileInfoModel {
  filename: string;
  occurrences: number;
  latestDate: string;
  expandOccurence: OccurenceModel[];
  expanded?: boolean;
}
