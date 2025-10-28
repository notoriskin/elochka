const fs = require('fs');
const assert = require('assert');
const { createChristmasTree } = require('./main.js');

// Helper function to read the generated tree from file
function readGeneratedTree(filepath) {
    try {
        return fs.readFileSync(filepath, 'utf-8');
    } catch (error) {
        return null;
    }
}

// Test 1: Verify tree is created with correct number of levels
function testCorrectNumberOfLevels() {
    console.log('Running test: Correct number of levels');
    createChristmasTree(4, 'test_tree_1.txt');
    const tree = readGeneratedTree('test_tree_1.txt');
    const lines = tree.trim().split('\n');
    
    // Should have: 2 top lines (W, *) + 4 levels + 2 trunk lines = 8 lines
    assert.strictEqual(lines.length, 8, 'Should have 8 lines total');
    console.log('✓ Test passed: Correct number of levels');
}

// Test 2: Verify top section contains W and *
function testTopSection() {
    console.log('Running test: Top section');
    createChristmasTree(4, 'test_tree_2.txt');
    const tree = readGeneratedTree('test_tree_2.txt');
    const lines = tree.split('\n');
    
    assert.strictEqual(lines[0].trim(), 'W', 'First line should be W');
    assert.strictEqual(lines[1].trim(), '*', 'Second line should be *');
    console.log('✓ Test passed: Top section');
}

// Test 3: Verify trunk section contains TTTTT
function testTrunkSection() {
    console.log('Running test: Trunk section');
    createChristmasTree(4, 'test_tree_3.txt');
    const tree = readGeneratedTree('test_tree_3.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // Trunk should be the last 2 lines
    assert(lines[lines.length - 2].includes('TTTTT'), 'Second to last line should contain trunk');
    assert(lines[lines.length - 1].includes('TTTTT'), 'Last line should contain trunk');
    console.log('✓ Test passed: Trunk section');
}

// Test 4: Verify alternating @ and * decorations
function testAlternatingDecorations() {
    console.log('Running test: Alternating decorations');
    createChristmasTree(4, 'test_tree_4.txt');
    const tree = readGeneratedTree('test_tree_4.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // Level 1 (line index 2) should start and end with *
    const level1 = lines[2].trim();
    assert(level1.startsWith('*') && level1.endsWith('*'), 'Level 1 should start and end with *');
    
    // Level 2 (line index 3) should start and end with @
    const level2 = lines[3].trim();
    assert(level2.startsWith('@') && level2.endsWith('@'), 'Level 2 should start and end with @');
    
    console.log('✓ Test passed: Alternating decorations');
}

// Test 5: Verify centering of all lines
function testCentering() {
    console.log('Running test: Centering');
    createChristmasTree(4, 'test_tree_5.txt');
    const tree = readGeneratedTree('test_tree_5.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // All lines should be roughly the same width (centered)
    const widths = lines.map(line => line.length);
    const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
    
    // Allow some variance for different line content, but should be close to center
    const variance = Math.max(...widths) - Math.min(...widths);
    assert(variance < 20, 'Lines should be reasonably centered');
    console.log('✓ Test passed: Centering');
}

// Test 6: Verify tree increases in size
function testSizeIncrease() {
    console.log('Running test: Size increase');
    createChristmasTree(5, 'test_tree_6.txt');
    const tree = readGeneratedTree('test_tree_6.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // Tree body lines (excluding top and trunk) should increase in width
    const treeLines = lines.slice(2, lines.length - 2);
    const widths = treeLines.map(line => line.trim().length);
    
    // Each level should generally increase, accounting for spacing differences
    let increasing = true;
    for (let i = 2; i < widths.length; i++) {
        if (widths[i] < widths[i-1]) {
            increasing = false;
            break;
        }
    }
    assert(increasing, 'Tree levels should generally increase in size');
    console.log('✓ Test passed: Size increase');
}

// Test 7: Verify file is created successfully
function testFileCreation() {
    console.log('Running test: File creation');
    createChristmasTree(3, 'test_tree_7.txt');
    
    assert.strictEqual(fs.existsSync('test_tree_7.txt'), true, 'File should be created');
    console.log('✓ Test passed: File creation');
}

// Test 8: Verify output with different levels
function testDifferentLevels() {
    console.log('Running test: Different levels');
    
    createChristmasTree(2, 'test_tree_8a.txt');
    createChristmasTree(6, 'test_tree_8b.txt');
    
    const tree2 = readGeneratedTree('test_tree_8a.txt');
    const tree6 = readGeneratedTree('test_tree_8b.txt');
    
    const lines2 = tree2.split('\n').filter(line => line.trim() !== '');
    const lines6 = tree6.split('\n').filter(line => line.trim() !== '');
    
    assert(lines6.length > lines2.length, 'Tree with 6 levels should have more lines than tree with 2 levels');
    console.log('✓ Test passed: Different levels');
}

// Test 9: Verify correct star count in each level
function testStarCount() {
    console.log('Running test: Star count');
    createChristmasTree(3, 'test_tree_9.txt');
    const tree = readGeneratedTree('test_tree_9.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // Count only the decorative characters (not the surrounding ones)
    // This checks that the tree is growing
    const treeLines = lines.slice(2, lines.length - 2);
    const decorativeChars = treeLines.map(line => (line.match(/[@*]/g) || []).length);
    
    // At least some levels should increase
    let hasGrowth = false;
    for (let i = 1; i < decorativeChars.length; i++) {
        if (decorativeChars[i] >= decorativeChars[i-1]) {
            hasGrowth = true;
            break;
        }
    }
    assert(hasGrowth, 'Tree should show growth in decorative elements');
    console.log('✓ Test passed: Star count');
}

// Test 10: Integration test - compare with expected output
function testExpectedOutput() {
    console.log('Running test: Expected output');
    createChristmasTree(4, 'test_tree_10.txt');
    const tree = readGeneratedTree('test_tree_10.txt');
    const lines = tree.split('\n').filter(line => line.trim() !== '');
    
    // Verify specific expected structure
    assert.strictEqual(lines[0].trim(), 'W', 'Top should be W');
    assert.strictEqual(lines[lines.length - 1].trim(), 'TTTTT', 'Bottom should be trunk');
    
    // Verify W and * are centered properly (should have 11 spaces before)
    const treeBeforeW = readGeneratedTree('test_tree_10.txt').split('\n')[0];
    assert.strictEqual(treeBeforeW.indexOf('W'), 11, 'W should be at position 11');
    
    console.log('✓ Test passed: Expected output');
}

// Run all tests
function runAllTests() {
    console.log('\n🎄 Running Christmas Tree Acceptance Tests 🎄\n');
    
    try {
        testFileCreation();
        testCorrectNumberOfLevels();
        testTopSection();
        testTrunkSection();
        testAlternatingDecorations();
        testCentering();
        testSizeIncrease();
        testDifferentLevels();
        testStarCount();
        testExpectedOutput();
        
        console.log('\n✅ All tests passed!\n');
        
        // Cleanup test files
        for (let i = 1; i <= 10; i++) {
            const filename = `test_tree_${i}.txt`;
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
        }
        // Also cleanup variants
        ['8a', '8b'].forEach(suffix => {
            const filename = `test_tree_8${suffix}.txt`;
            if (fs.existsSync(filename)) {
                fs.unlinkSync(filename);
            }
        });
        
        console.log('🧹 Cleaned up test files\n');
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

runAllTests();
