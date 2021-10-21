// bookmarking
const bookmarkDiv = document.querySelector(".bookmark-action")

let isBookmarked = JSON.parse(localStorage.getItem("isBookmarked"))

if (isBookmarked) bookmarkDiv.classList.add("bookmarked")

const handleBookmarkClick = () => {
    if (!isBookmarked) {
        localStorage.setItem("isBookmarked", "true")
        bookmarkDiv.classList.add("bookmarked")
        isBookmarked = true
    } else {
        localStorage.setItem("isBookmarked", "false")
        bookmarkDiv.classList.remove("bookmarked")
        isBookmarked = false
    }
}

bookmarkDiv.addEventListener("click", handleBookmarkClick)

// toggle mobile menu

const menuTogglerNode = document.querySelector(".menu-toggler")
const mobileMenuDiv = document.querySelector(".mobile-nav")

const handleMenuToggleClick = () => {
    menuTogglerNode.classList.toggle("close-menu")
    mobileMenuDiv.classList.toggle("hidden")
}

menuTogglerNode.addEventListener("click", handleMenuToggleClick)

// initialization

const getLocalStorageItem = (item, defaultValue = "0") => {
    const value = JSON.parse(localStorage.getItem(item))
    if (value === null) {
        localStorage.setItem(item, defaultValue)
        return parseInt(defaultValue)
    } else return value
}

const backedNode = document.querySelector(".backed")
const backersNode = document.querySelector(".backers")
const daysLeftNode = document.querySelector(".days-left")

const bambooStandLeftNode = document.querySelectorAll(".bamboo-left")
const blackLeftNode = document.querySelectorAll(".black-left")
const mahoganyLeftNode = document.querySelectorAll(".mahogany-left")

const progressBarDiv = document.querySelector(".current-progress")

let currBacked = getLocalStorageItem("currBacked", 13012)
let currBackers = getLocalStorageItem("currBackers")
// moze ovo i da se racuna
let currDaysleft = getLocalStorageItem("currDaysleft", "69")

let bambooStandLeft = getLocalStorageItem("bambooStandLeft", "100")
let blackEditionLeft = getLocalStorageItem("blackEditionLeft", "50")
let mahoganySpecialLeft = getLocalStorageItem("mahoganySpecialLeft", "0")

const updateProgressBar = () => progressBarDiv.style.width = `${currBacked / 100000 * 100}%`

const renderData = () => {
    backedNode.textContent = "$" + currBacked.toLocaleString()
    backersNode.textContent = currBackers.toLocaleString()
    daysLeftNode.textContent = currDaysleft

    bambooStandLeftNode.forEach(el => el.textContent = bambooStandLeft)
    blackLeftNode.forEach(el => el.textContent = blackEditionLeft)
    mahoganyLeftNode.forEach(el => el.textContent = mahoganySpecialLeft)

    disableUnavailableRewards()
    updateProgressBar()
}

// selecting reward

const selectionModalBtnNodes = document.querySelectorAll(".open-selection-modal")
const selectionModal = document.querySelector(".selection-modal-wrapper")
const closeSelectionModal = selectionModal.querySelector(".close-modal")
const successModal = document.querySelector(".modal-success-wrapper")
const closeSuccessModal = successModal.querySelector(".close-modal-success")

const selectionRadioButtons = document.querySelectorAll(".option-selection-name")

const toggleSelectionModal = () => {
    selectionModal.classList.toggle("hidden")
}

const selectOption = node => {
    selectionRadioButtons.forEach(el => el.closest(".option-wrapper").classList.remove("selected"))
    node.closest(".option-wrapper").classList.add("selected")
}

selectionModalBtnNodes.forEach(node => {
    node.addEventListener("click", toggleSelectionModal)
})
closeSelectionModal.addEventListener("click", toggleSelectionModal)

selectionRadioButtons.forEach(el => el.addEventListener("click", () => selectOption(el)))

// pledge selection 

const pledgeButtons = document.querySelectorAll("button.modal-pledge-action")

// lazy

const disableMahoganyReward = () => document.querySelectorAll(".mahogany-reward").forEach(node => node.classList.add("unavailable"))
const disableBlackReward = () => document.querySelectorAll(".black-reward").forEach(node => node.classList.add("unavailable"))
const disableBambooReward = () => document.querySelectorAll(".mahogany-reward").forEach(node => node.classList.add("unavailable"))

const disableUnavailableRewards = () => {
    if (mahoganySpecialLeft <= 0) {
        disableMahoganyReward()
    }
    if (blackEditionLeft <= 0) {
        disableBlackReward()
    }
    if (bambooStandLeft <= 0) {
        disableBambooReward()
    }
}

const updateData = moneyPledged => {
    let noReward = true
    const pledgedNumeric = parseInt(moneyPledged)
    currBacked += pledgedNumeric
    currBackers++

    // get closest reward
    if (pledgedNumeric >= 200) {
        if (mahoganySpecialLeft !== 0) {
            mahoganySpecialLeft--
            localStorage.setItem("mahoganySpecialLeft", mahoganySpecialLeft)
        } else noReward = true
    } 
    if (pledgedNumeric >= 75 && noReward) {
        if(blackEditionLeft !== 0) {
            blackEditionLeft--
            localStorage.setItem("blackSpecialLeft", blackEditionLeft)
            noReward = false
        } else noReward = true
    } 
    if (pledgedNumeric >= 25 && noReward) {
        if(bambooStandLeft > 0) {
            bambooStandLeft--
            localStorage.setItem("bambooStandLeft", bambooStandLeft)
        }
    }

    localStorage.setItem("currBacked", currBacked.toString())
    localStorage.setItem("currBackers", currBackers.toString())
}

const toggleSuccessModal = () => {
    successModal.classList.toggle("hidden")
    console.log("lol")
}

const handlePledgeClick = btn => {
    const val = btn.closest(".enter-pledge-action").querySelector(".pledge-input").value
    updateData(val)
    toggleSelectionModal()
    toggleSuccessModal()
    renderData()
}

pledgeButtons.forEach(btn => btn.addEventListener("click", () => handlePledgeClick(btn)))
closeSuccessModal.addEventListener("click", toggleSuccessModal)

updateProgressBar()
renderData()