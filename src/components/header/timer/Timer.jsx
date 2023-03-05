import './styles/NumCounter.css';

const Timer = ({time}) => {

  let firstNum = 'number'+ Math.trunc(time/10);
  let secondNum = 'number'+ time%10;

  return (
    <div className="container">
      <div className='numbers number0' ></div>
      <div className={'numbers '+ firstNum} ></div>
      <div className={'numbers '+ secondNum}></div>
    </div>
  )
}

export default Timer;