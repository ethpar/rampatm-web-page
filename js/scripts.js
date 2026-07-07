/*!
 * Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener('DOMContentLoaded', (event) => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav')
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74
        })
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler')
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    )
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click()
            }
        })
    })

    // Contact form handler
    document
        .getElementById('contactForm')
        .addEventListener('submit', async function (e) {
            e.preventDefault()

            const name = document.getElementById('name').value.trim()
            const email = document.getElementById('email').value.trim()
            const phone = document.getElementById('phone').value.trim()
            const contact = `${email} | ${phone}`
            const message = document.getElementById('message').value.trim()

            // Show progress spinner on the submit button
            const submitBtn = document.getElementById('submitButton')
            const originalBtnText = submitBtn.innerHTML
            submitBtn.disabled = true
            submitBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…'

            const response = await fetch(
                'https://ibm7bagudkufu6snu7ulxfpliu0oamdl.lambda-url.us-east-1.on.aws/',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        name,
                        contact,
                        notes: message
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            submitBtn.innerHTML = "Request Sent"

            setTimeout(() => {
                submitBtn.disabled = false
                submitBtn.innerHTML = originalBtnText

                const contactModalEl = document.getElementById('feedbackModal')
                const contactModal = bootstrap.Modal.getInstance(contactModalEl)
                if (contactModal) {
                    contactModal.hide()
                }
            }, 2000)
        })

    // Copy email address button in fallback modal
    const copyEmailBtn = document.getElementById('copyEmailBtn')
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function () {
            navigator.clipboard
                .writeText('info@rampatm.com')
                .then(() => {
                    copyEmailBtn.textContent = 'Copied!'
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'Copy Email Address'
                    }, 2000)
                })
                .catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea')
                    textarea.value = 'info@rampatm.com'
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textarea)
                    copyEmailBtn.textContent = 'Copied!'
                    setTimeout(() => {
                        copyEmailBtn.textContent = 'Copy Email Address'
                    }, 2000)
                })
        })
    }
})
