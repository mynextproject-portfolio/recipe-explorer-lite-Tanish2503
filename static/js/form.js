// Dynamic form fields for ingredients and instructions

var MAX_INGREDIENTS = 20;
const maxInstructions = 15;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Form JS loaded');  // Debug log
    
    // Ingredients functionality
    const ingredientsContainer = document.getElementById('ingredients-container');
    const addIngredientBtn = document.getElementById('add-ingredient');
    
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', function() {
            addIngredient();
        });
    }
    
    if (ingredientsContainer) {
        // Add event listeners to existing remove buttons
        ingredientsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-ingredient')) {
                removeIngredient(e.target);
            }
        });
    }
    
    // Instructions functionality  
    const instructionsContainer = document.getElementById('instructions-container');
    const addInstructionBtn = document.getElementById('add-instruction');
    
    if (addInstructionBtn) {
        addInstructionBtn.addEventListener('click', function() {
            addInstruction();
        });
    }
    
    if (instructionsContainer) {
        // Add event listeners to existing remove buttons
        instructionsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-instruction')) {
                removeInstruction(e.target);
            }
        });

        setupInstructionDragAndDrop(instructionsContainer);
    }

    // Update instruction numbers when page loads
    updateInstructionNumbers();
});

function addIngredient() {
    const container = document.getElementById('ingredients-container');
    
    // Check max ingredients (not enforced in backend)
    var currentCount = container.children.length;
    if (currentCount >= MAX_INGREDIENTS) {
        alert("Maximum " + MAX_INGREDIENTS + " ingredients allowed");
        return;
    }
    
    const ingredientDiv = document.createElement('div');
    ingredientDiv.className = 'ingredient-item mb-2';
    
    ingredientDiv.innerHTML = `
        <div class="input-group">
            <input type="text" class="form-control ingredient-input" 
                   placeholder="Enter ingredient..." required>
            <button type="button" class="btn btn-outline-danger remove-ingredient">Remove</button>
        </div>
    `;
    
    container.appendChild(ingredientDiv);
    console.log("Added ingredient field");  // Another debug log
}

function removeIngredient(button) {
    const ingredientItem = button.closest('.ingredient-item');
    const container = document.getElementById('ingredients-container');
    
    // Don't remove if it's the only ingredient
    if (container.children.length > 1) {
        ingredientItem.remove();
    }
}

function addInstruction() {
    const container = document.getElementById('instructions-container');

    // Check max instructions (not enforced in backend)
    if (container.children.length >= maxInstructions) {
        alert("Maximum " + maxInstructions + " instruction steps allowed");
        return;
    }

    const instructionDiv = document.createElement('div');
    instructionDiv.className = 'instruction-item mb-2';
    instructionDiv.setAttribute('draggable', 'true');

    const nextNumber = container.children.length + 1;

    instructionDiv.innerHTML = `
        <div class="input-group">
            <span class="input-group-text drag-handle" title="Drag to reorder">⠿</span>
            <span class="input-group-text step-number">${nextNumber}</span>
            <textarea class="form-control instruction-input" rows="2"
                      placeholder="Enter instruction step..." required></textarea>
            <button type="button" class="btn btn-outline-danger remove-instruction">Remove</button>
        </div>
    `;

    container.appendChild(instructionDiv);
}

function removeInstruction(button) {
    const instructionItem = button.closest('.instruction-item');
    const container = document.getElementById('instructions-container');

    // Don't remove if it's the only instruction
    if (container.children.length > 1) {
        instructionItem.remove();
        updateInstructionNumbers();
    }
}

function updateInstructionNumbers() {
    const container = document.getElementById('instructions-container');
    if (!container) return;

    const instructionItems = container.querySelectorAll('.instruction-item');
    instructionItems.forEach((item, index) => {
        const numberSpan = item.querySelector('.step-number');
        if (numberSpan) {
            numberSpan.textContent = index + 1;
        }
    });
}

function setupInstructionDragAndDrop(container) {
    let draggedItem = null;

    container.addEventListener('dragstart', function(e) {
        draggedItem = e.target.closest('.instruction-item');
        if (!draggedItem) return;
        draggedItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', function() {
        if (draggedItem) draggedItem.classList.remove('dragging');
        draggedItem = null;
        updateInstructionNumbers();
    });

    container.addEventListener('dragover', function(e) {
        if (!draggedItem) return;
        e.preventDefault();

        const target = e.target.closest('.instruction-item');
        if (!target || target === draggedItem) return;

        const rect = target.getBoundingClientRect();
        const isAfter = (e.clientY - rect.top) > rect.height / 2;
        container.insertBefore(draggedItem, isAfter ? target.nextSibling : target);
    });
}
