document.addEventListener('DOMContentLoaded', function() {
    // Developer Cost Calculator Logic
    const maxPriceInput = document.getElementById('maxPrice');
    const priceSlider = document.getElementById('priceSlider');
    const sliderValue = document.getElementById('sliderValue');
    const developerCountInput = document.getElementById('developerCount');
    const developerSlidersDisplay = document.getElementById('developerSliders');
    const developerCostsDisplay = document.getElementById('developerCosts');
    const completedPayments = document.getElementById('completedPayments');
    const pendingPayments = document.getElementById('pendingPayments');

    function calculateCost() {
        const maxPrice = parseFloat(maxPriceInput.value);
        const totalPercentage = parseFloat(priceSlider.value);
        const developerCount = parseInt(developerCountInput.value);

        // Clear previous developer sliders and costs
        developerSlidersDisplay.innerHTML = '';
        developerCostsDisplay.innerHTML = '';

        // Generate individual developer sliders
        const developerPercentages = [];
        for (let i = 1; i <= developerCount; i++) {
            const sliderId = `developerSlider${i}`;
            const sliderLabelId = `developerSliderLabel${i}`;

            const sliderDiv = document.createElement('div');
            sliderDiv.innerHTML = `
                <label for="${sliderId}">Developer ${i} Contribution (%):</label>
                <input type="range" class="form-control-range developer-slider" id="${sliderId}" min="0" max="${totalPercentage}" value="${totalPercentage / developerCount}">
                <span id="${sliderLabelId}">${(totalPercentage / developerCount).toFixed(2)}%</span>
            `;
            developerSlidersDisplay.appendChild(sliderDiv);

            // Store initial percentage
            developerPercentages.push(totalPercentage / developerCount);

            // Add event listener to each slider
            const slider = document.getElementById(sliderId);
            const sliderLabel = document.getElementById(sliderLabelId);
            slider.addEventListener('input', function() {
                const sliderValue = parseFloat(slider.value);
                const maxAllowed = parseFloat(priceSlider.value);
                if (sliderValue > maxAllowed) {
                    slider.value = maxAllowed;
                }
                sliderLabel.textContent = sliderValue.toFixed(2) + "%";
                developerPercentages[i - 1] = parseFloat(sliderValue);
                adjustPercentages(developerPercentages); // Adjust percentages
                calculateDeveloperCosts(maxPrice, developerPercentages);
            });
        }

        calculateDeveloperCosts(maxPrice, developerPercentages);
        sliderValue.textContent = totalPercentage + "%";
    }

    function calculateDeveloperCosts(maxPrice, developerPercentages) {
        developerCostsDisplay.innerHTML = '';
        const developerCostPerPercentage = maxPrice / 100;
        let totalDeveloperCost = 0;

        for (let i = 0; i < developerPercentages.length; i++) {
            const percentage = developerPercentages[i];
            const developerCost = developerCostPerPercentage * percentage;
            totalDeveloperCost += developerCost;

            const developerCostDiv = document.createElement('div');
            developerCostDiv.className = 'developer-cost-item'; // Add a class for styling
            developerCostDiv.innerHTML = `
                <span class="developer-label">Developer ${i + 1}:</span>
                <span class="developer-amount">$${developerCost.toFixed(2)}</span>
            `;
            developerCostsDisplay.appendChild(developerCostDiv);
        }

        const companyProfit = maxPrice - totalDeveloperCost;
        completedPayments.textContent = `$ ${companyProfit.toFixed(2)}`;
        pendingPayments.textContent = `$ ${totalDeveloperCost.toFixed(2)}`;
    }

    function adjustPercentages(percentages) {
        let total = percentages.reduce((a, b) => a + b, 0);
        if (total > parseFloat(priceSlider.value)) {
            const excess = total - parseFloat(priceSlider.value);
            const adjustableDevelopers = percentages.length;
            const adjustmentPerDeveloper = excess / adjustableDevelopers;

            for (let i = 0; i < percentages.length; i++) {
                if (percentages[i] - adjustmentPerDeveloper > 0) {
                    percentages[i] -= adjustmentPerDeveloper;
                } else {
                    percentages[i] = 0;
                }
                const slider = document.getElementById(`developerSlider${i + 1}`);
                const sliderLabel = document.getElementById(`developerSliderLabel${i + 1}`);
                slider.value = percentages[i].toFixed(2);
                sliderLabel.textContent = percentages[i].toFixed(2) + "%";
            }
        }
    }

    maxPriceInput.addEventListener('input', calculateCost);
    priceSlider.addEventListener('input', calculateCost);
    developerCountInput.addEventListener('input', calculateCost);

    calculateCost(); // Initial calculation
});