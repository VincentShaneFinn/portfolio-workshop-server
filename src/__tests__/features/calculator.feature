Feature: Calculator

    Perform basic calulations

    Scenario: Add two numbers
        Given I enter two numbers
        When I add them
        Then I expect the sum

    Scenario: Multiply two numbers
        Given I enter two numbers
        When I multiply them
        Then I expect the sum