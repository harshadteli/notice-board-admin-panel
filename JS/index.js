const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySlg852_P770a_mBtiS610WtIbtcFe8f3uLk2hYoXb30FqW6E700My6vae977zGgLurw/exec';
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const addNoticeForm = document.getElementById('add-notice-form');
const addNoticeMessage = document.getElementById('add-notice-message');
const logoutBtn = document.getElementById('logout-btn');
const noticesList = document.getElementById('notices-list');
const loginContainer = document.getElementById('login-container');
const managementContainer = document.getElementById('management-container');
const addNoticeOpenBtn = document.getElementById('add-notice-open-btn');
const addNoticeCloseBtn = document.getElementById('add-notice-close-btn');
const addNoticeModal = document.getElementById('add-notice-modal');
const welcomeUserDisplay = document.getElementById('welcome-user-display');
const panelTitle = document.getElementById('panel-title');
const loadingSpinner = document.createElement('div');
loadingSpinner.id = 'loading-spinner';
loadingSpinner.className = 'spinner';
document.body.appendChild(loadingSpinner);
let currentUser = null; 
function formatContentForHtml(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/(\r\n|\r|\n)/g, '<br>');
}
function showSpinner() {
    loadingSpinner.style.display = 'block'; 
}
function hideSpinner() {
    loadingSpinner.style.display = 'none';
}
function showManagementPanel() {
    loginContainer.style.display = 'none';
    managementContainer.style.display = 'block';
    const userName = (currentUser && currentUser.name) ? currentUser.name : 'Faculty';
    welcomeUserDisplay.textContent = `👋 Welcome, ${userName}`;
}
function showAddNoticeForm() {
    addNoticeModal.style.display = 'flex';
    addNoticeMessage.textContent = ''; 
}
function hideAddNoticeForm() {
    addNoticeModal.style.display = 'none';
    addNoticeForm.reset(); 
}
async function fetchFacultyNotices() 
    {
    noticesList.innerHTML = '<p>Loading notices...</p>';
    showSpinner(); 
    try 
    {
        const response = await fetch(`${SCRIPT_URL}?action=getNotices`);
        const notices = await response.json();
        if (notices.length === 0 || notices.error) 
        {
            noticesList.innerHTML = '<p>No notices have been posted yet.</p>';
        } 
        else 
        {
            noticesList.innerHTML = '';
            notices.forEach(notice => {
                const displayContent = formatContentForHtml(notice.content);
                const noticeItem = document.createElement('div');
                noticeItem.classList.add('notice-item');
                noticeItem.innerHTML = `
                    <div class="notice-info">
                        <h4>${notice.title}<br> (${notice.subject || 'N/A'})</h4>
                        <p>Class: ${notice.bcsYear || 'N/A'} <br> Div ${notice.division || 'N/A'}</p>
                        <p>Posted by: ${notice.teacher || 'N/A'} on ${notice.date}</p>
                    </div>
                    <button class="delete-btn" data-id="${notice.id}">Delete</button>
                `;
                noticesList.appendChild(noticeItem);
            });
        }
    } 
    catch (error) 
    {
        console.error('Error fetching faculty notices:', error);
        noticesList.innerHTML = '<p class="error-message">Failed to load notices.</p>';
    } 
    finally 
    {
        hideSpinner(); 
    }
}
if (localStorage.getItem('isLoggedIn') === 'true') 
    {
    try 
    {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } 
    catch (e) 
    {
        console.error("Failed to parse currentUser from localStorage", e);
        localStorage.removeItem('isLoggedIn');
    }
    if (currentUser) 
    {
        showManagementPanel();
        fetchFacultyNotices();
    }
}
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value; 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const params = new URLSearchParams({ action: 'login', name, email, password });
    loginMessage.textContent = 'Verifying credentials...';
    showSpinner(); 
    try 
    {
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const result = await response.json();
        if (result.success) 
        {
            loginMessage.textContent = 'Login successful!';
            loginMessage.className = 'message success';
            currentUser = result.user; 
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); 
            showManagementPanel();
            fetchFacultyNotices();
        } 
        else 
        {
            loginMessage.textContent = 'Login failed: ' + (result.error || 'Invalid credentials or failed registration.');
            loginMessage.className = 'message error';
        }
    } 
    catch (error) 
    {
        console.error('Login error:', error);
        loginMessage.textContent = 'A network error occurred. Please try again later.';
        loginMessage.className = 'message error';
    } 
    finally 
    {
        hideSpinner(); 
    }
});
addNoticeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const authorName = (currentUser && currentUser.name) ? currentUser.name : 'Unknown Faculty';
    const title = document.getElementById('notice-title').value;
    const content = document.getElementById('notice-content').value;
    const teacher = document.getElementById('teacher-name').value;
    const subject = document.getElementById('subject-name').value;
    const division = document.getElementById('division').value;
    const bcsYear = document.getElementById('bcs-year').value;
    const params = new URLSearchParams({ 
        action: 'addNotice', title, content, author: authorName, 
        teacher, subject, division, bcsYear 
    });
    addNoticeMessage.textContent = 'Adding notice...';
    showSpinner(); 
    try 
    {
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`, { method: 'POST' });
        const result = await response.json();
        if (result.success) 
        {
            addNoticeMessage.textContent = 'Notice added successfully!';
            addNoticeMessage.className = 'message success';
            
            setTimeout(() => {
                hideAddNoticeForm(); 
            }, 1000); 

            fetchFacultyNotices(); 
        } 
        else 
        {
            addNoticeMessage.textContent = 'Failed to add notice: ' + (result.error || 'Unknown error.');
            addNoticeMessage.className = 'message error';
        }
    } 
    catch (error) 
    {
        console.error('Add notice error:', error);
        addNoticeMessage.textContent = 'An error occurred. Please try again.';
        addNoticeMessage.className = 'message error';
    } 
    finally 
    {
        hideSpinner(); 
    }
});
noticesList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) 
        {
        const noticeId = e.target.dataset.id;

        if (confirm('Are you sure you want to delete this notice?')) 
            {
            const params = new URLSearchParams({ action: 'deleteNotice', id: noticeId });
            showSpinner(); 

            try 
            {
                const response = await fetch(`${SCRIPT_URL}?${params.toString()}`, { method: 'POST' });
                const result = await response.json();

                if (result.success) 
                {
                    alert('Notice deleted successfully!');
                    fetchFacultyNotices(); 
                } 
                else 
                {
                    alert('Failed to delete notice: ' + (result.error || 'Unknown error.'));
                }
            } 
            catch (error) 
            {
                console.error('Delete notice error:', error);
                alert('An error occurred. Please try again.');
            } 
            finally 
            {
                hideSpinner(); 
            }
        }
    }
});
addNoticeOpenBtn.addEventListener('click', showAddNoticeForm);
addNoticeCloseBtn.addEventListener('click', hideAddNoticeForm);
addNoticeModal.addEventListener('click', (e) => {
    if (e.target.id === 'add-notice-modal') 
    {
        hideAddNoticeForm();
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.reload(); 
});
