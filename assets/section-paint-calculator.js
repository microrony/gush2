const calculateButton = document.querySelector('.calculate-button')

calculateButton.onclick = function() {
	const floorArea = parseInt(document.getElementById('floorArea').value)
	if (Number.isNaN(floorArea)) return

  const paintRequired = document.querySelector('.paint-required')
	const sealerRequired = document.querySelector('.sealer-required')

	const paintedArea = floorArea * 2.8
	const amountOfPaintRequired = paintedArea / 58
	const amountOfSealerRequired = amountOfPaintRequired / 2.25

	paintRequired.textContent = Math.round(amountOfPaintRequired);
	sealerRequired.textContent = Math.round(amountOfSealerRequired);
}