const calculateButtonMbl = document.querySelector('.calculate-button.mobile')
const calculateButtonDsk = document.querySelector('.calculate-button.desktop')

calculateButtonMbl.onclick = calculatePaint
calculateButtonDsk.onclick = calculatePaint
function calculatePaint() {
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