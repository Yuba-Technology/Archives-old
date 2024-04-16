/* eslint-disable camelcase */
import { convertKeysToCamelCase } from "@/models/utils/utils.js";

describe("convertKeysToCamelCase", () => {
    it("should convert snake_case keys to camelCase for a flat object", () => {
        const snakeCaseObj = {
            first_name: "John",
            last_name: "Doe"
        };
        const expectedObj = {
            firstName: "John",
            lastName: "Doe"
        };

        expect(convertKeysToCamelCase(snakeCaseObj)).toEqual(expectedObj);
    });

    it("should convert snake_case keys to camelCase for a nested object", () => {
        const snakeCaseObj = {
            first_name: "John",
            last_name: "Doe",
            address: {
                street_name: "Main St",
                city_name: "Anytown"
            }
        };
        const expectedObj = {
            firstName: "John",
            lastName: "Doe",
            address: {
                streetName: "Main St",
                cityName: "Anytown"
            }
        };

        expect(convertKeysToCamelCase(snakeCaseObj)).toEqual(expectedObj);
    });

    it("should not modify keys that are already in camelCase", () => {
        const camelCaseObj = {
            firstName: "John",
            lastName: "Doe"
        };

        expect(convertKeysToCamelCase(camelCaseObj)).toEqual(camelCaseObj);
    });
});
