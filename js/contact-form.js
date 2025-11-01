document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(form);
        
        // Добавляем Access Key (ЗАМЕНИТЕ НА СВОЙ!)
        formData.append('access_key', 'a3cde093-1728-487a-b34a-cd676a5cd4f5');
        
        // Конвертируем в JSON
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);
        
        // Меняем текст кнопки
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Отправка...';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-warning');
        
        try {
            // Отправляем запрос
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });
            
            const result = await response.json();
            
            if (result.success) {
                // УСПЕХ!
                submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Отправлено!';
                submitBtn.classList.remove('btn-warning', 'btn-primary');
                submitBtn.classList.add('btn-success');
                
                // Показываем уведомление
                showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Очищаем форму
                form.reset();
                
                // Возвращаем кнопку через 3 секунды
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-primary');
                }, 3000);
                
            } else {
                throw new Error('Ошибка отправки');
            }
            
        } catch (error) {
            // ОШИБКА
            console.error('Error:', error);
            submitBtn.innerHTML = '<i class="bi bi-x-circle me-2"></i>Ошибка!';
            submitBtn.classList.remove('btn-warning', 'btn-primary');
            submitBtn.classList.add('btn-danger');
            
            showNotification('Ошибка отправки. Попробуйте позже или свяжитесь напрямую.', 'danger');
            
            // Возвращаем кнопку через 3 секунды
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-danger');
                submitBtn.classList.add('btn-primary');
            }, 3000);
        }
    });
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}
