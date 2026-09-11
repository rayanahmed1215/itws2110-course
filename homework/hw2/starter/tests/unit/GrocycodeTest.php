<?php

use Grocy\Helpers\Grocycode;
use PHPUnit\Framework\TestCase;

// One working unit test on Grocy's own code. Grocycode::Validate() is a pure
// function -- string in, boolean out, no database, no globals -- which is why
// it is the right place to start.
//
// The format, from the docblock in grocy/www/helpers/Grocycode.php:
//   grcy : <type> : <id> [ : extra ... ]
// Read that file, then write at least five more tests for Task 2.

final class GrocycodeTest extends TestCase
{
    public function test_a_product_code_is_valid(): void
    {
        // A pure function: assert( act( arrange ) ) on one line, like DueDateTest.
        $this->assertTrue(Grocycode::Validate('grcy:p:42'));
    }
}
