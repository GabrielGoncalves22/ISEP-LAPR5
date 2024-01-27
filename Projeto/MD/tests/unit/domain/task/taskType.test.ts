import { expect } from 'chai';

import { TaskType } from '../../../../src/domain/task/taskType';

describe('taskType enum', () => {
    it('should have Surveillance defined', () => {
        expect(TaskType).to.have.property('Surveillance');
    });

    it('should have Transport defined', () => {
        expect(TaskType).to.have.property('Transport');
    });
});