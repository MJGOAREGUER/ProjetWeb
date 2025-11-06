import './Calculator.css';

function Display({value}) {
    return (
        <div className='py-4 px-4 bg-gray-400 mb-3 rounded-md'>
            <p>{value}</p>
        </div>
    );
}

export default Display;
