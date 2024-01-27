import { expect } from 'chai';

import { Building } from "../../../../src/domain/building/building";
import { BuildingCode } from '../../../../src/domain/building/buildingCode';
import { BuildingName } from '../../../../src/domain/building/buildingName';
import { Description } from '../../../../src/domain/building/description';
import { Floor } from '../../../../src/domain/building/floor';
import { BuildingDimension } from '../../../../src/domain/building/buildingDimension';

describe('building entity', () => {
    it('can create a valid building object', () => {
        const buildingCode = BuildingCode.create('Teste').getValue();
        const buildingProps = {
            code: buildingCode,
            name: BuildingName.create('Nome do edifício').getValue(),
            description: Description.create('Edifício de Teste').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(9).getValue(),
            floors: null as any,
            elevator: null as any
        };

        const buildingResult = Building.create(buildingProps, buildingCode);

        expect(buildingResult.isSuccess).to.be.true;

        const building = buildingResult.getValue();
        expect(building.code).to.deep.equal(BuildingCode.create('Teste').getValue());
        expect(building.name).to.deep.equal(BuildingName.create('Nome do edifício').getValue());
        expect(building.description).to.deep.equal(Description.create('Edifício de Teste').getValue());
        expect(building.numXCells).to.deep.equal(BuildingDimension.create(10).getValue());
        expect(building.numYCells).to.deep.equal(BuildingDimension.create(9).getValue());
        
    });

    it('should fail to create an building object with null X cells dimension', () => {
        const buildingCode = BuildingCode.create('Teste').getValue();
        const buildingProps = {
            code: buildingCode,
            name: BuildingName.create('Nome do edifício').getValue(),
            description: Description.create('Edifício de Teste').getValue(),
            numXCells: null as any,
            numYCells: BuildingDimension.create(9).getValue(),
            floors: null as any,
            elevator: null as any
        };

        const buildingResult = Building.create(buildingProps, buildingCode);

        expect(buildingResult.isFailure).to.be.true;
        expect(buildingResult.error).to.equal('X Cells is null or undefined.');
    });

    it('should fail to create an building object with undefined X cells dimension', () => {
        const buildingCode = BuildingCode.create('Teste').getValue();
        const buildingProps = {
            code: buildingCode,
            name: BuildingName.create('Nome do edifício').getValue(),
            description: Description.create('Edifício de Teste').getValue(),
            numXCells: undefined as any,
            numYCells: BuildingDimension.create(9).getValue(),
            floors: null as any,
            elevator: null as any
        };

        const buildingResult = Building.create(buildingProps, buildingCode);

        expect(buildingResult.isFailure).to.be.true;
        expect(buildingResult.error).to.equal('X Cells is null or undefined.');
    });

    it('should fail to create an building object with null Y cells dimension', () => {
        const buildingCode = BuildingCode.create('Teste').getValue();
        const buildingProps = {
            code: buildingCode,
            name: BuildingName.create('Nome do edifício').getValue(),
            description: Description.create('Edifício de Teste').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: null as any,
            floors: null as any,
            elevator: null as any
        };

        const buildingResult = Building.create(buildingProps, buildingCode);

        expect(buildingResult.isFailure).to.be.true;
        expect(buildingResult.error).to.equal('Y Cells is null or undefined.');
    });

    it('should fail to create an building object with undefined Y cells dimension', () => {
        const buildingCode = BuildingCode.create('Teste').getValue();
        const buildingProps = {
            code: buildingCode,
            name: BuildingName.create('Nome do edifício').getValue(),
            description: Description.create('Edifício de Teste').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: undefined as any,
            floors: null as any,
            elevator: null as any
        };

        const buildingResult = Building.create(buildingProps, buildingCode);

        expect(buildingResult.isFailure).to.be.true;
        expect(buildingResult.error).to.equal('Y Cells is null or undefined.');
    });
});
