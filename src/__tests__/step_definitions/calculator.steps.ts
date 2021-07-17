import { defineFeature, loadFeature } from 'jest-cucumber';
import { Calculator } from '../../domain/calculator';

const feature = loadFeature('src/__tests__/features/calculator.feature');

defineFeature(feature, test => {
    let value1: number;
    let value2: number;
    let result: number;

    test('Add two numbers', ({
        given,
        when,
        then
    }) => {
        given('I enter two numbers', () => {
            value1 = 1;
            value2 = 2;
        });

        when('I add them', () => {
            result = Calculator.add(value1, value2);
        });

        then('I expect the sum', () => {
            expect(result).toBe(3);
        });
    });

    test('Multiply two numbers', ({
        given,
        when,
        then
    }) => {
        given('I enter two numbers', () => {
            value1 = 3;
            value2 = 4;
        });

        when('I multiply them', () => {
            result = Calculator.multiply(value1, value2);
        });

        then('I expect the sum', () => {
            expect(result).toBe(12);
        });
    });
});

