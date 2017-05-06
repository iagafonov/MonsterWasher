#define BRAKE 0
#define CW    1
#define CCW   2
#define LAST  3
#define CS_THRESHOLD 15   // Definition of safety current (Check: "1.3 Monster Shield Example").

//MOTOR 1
#define MOTOR_A1_PIN 7
#define MOTOR_B1_PIN 8

//MOTOR 2
#define MOTOR_A2_PIN 4
#define MOTOR_B2_PIN 9

#define PWM_MOTOR_1 5
#define PWM_MOTOR_2 6

#define CURRENT_SEN_1 A2
#define CURRENT_SEN_2 A3

#define EN_PIN_1 A0
#define EN_PIN_2 A1

#define MOTOR_1 0
#define MOTOR_2 1

// ULTRASONIC RANGEFINDER
#define TRIG_PIN 12
#define ECHO_PIN 13
 
void setup() {
  pinMode(MOTOR_A1_PIN, OUTPUT);
  pinMode(MOTOR_B1_PIN, OUTPUT);

  pinMode(MOTOR_A2_PIN, OUTPUT);
  pinMode(MOTOR_B2_PIN, OUTPUT);

  pinMode(PWM_MOTOR_1, OUTPUT);
  pinMode(PWM_MOTOR_2, OUTPUT);

  pinMode(CURRENT_SEN_1, OUTPUT);
  pinMode(CURRENT_SEN_2, OUTPUT);  

  pinMode(EN_PIN_1, OUTPUT);
  pinMode(EN_PIN_2, OUTPUT);
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.begin(9600); // Initiates the serial to do the monitoring
}


short usSpeed = 150;  // Default motor speed
short lastMotor1Status = BRAKE;
short lastMotor2Status = BRAKE;

void loop() {
  char user_input;

  while(Serial.available()) {
    user_input = Serial.read(); //Read user input and trigger appropriate function
    digitalWrite(EN_PIN_1, HIGH);
    digitalWrite(EN_PIN_2, HIGH); 
     
    if (user_input =='1') {
       Stop();
    } else if (user_input =='2') {
      Forward();
    } else if(user_input =='3') {
      Reverse();
    } else if (user_input =='4') {
      Left();
    } else if(user_input =='5') {
      Right();
    } else if (user_input =='+') {
      IncreaseSpeed();
    } else if (user_input =='-') {
      DecreaseSpeed();
    } else if (user_input =='d') {
      Distance();
    } else {
      Serial.println("Invalid option entered.");
    }
  }
}

void Stop() {
  Serial.println("Stop");
  motorGo(MOTOR_1, BRAKE, 0);
  motorGo(MOTOR_2, BRAKE, 0);
}

void Forward() {
  Serial.println("Forward");
  motorGo(MOTOR_1, CW, usSpeed);
  motorGo(MOTOR_2, CW, usSpeed);
}

void Reverse() {
  Serial.println("Reverse");
  motorGo(MOTOR_1, CCW, usSpeed);
  motorGo(MOTOR_2, CCW, usSpeed);
}

void Left() {
  Serial.println("Left");
  motorGo(MOTOR_1, CCW, usSpeed);
  motorGo(MOTOR_2, CW, usSpeed);
}

void Right() {
  Serial.println("Right");
  motorGo(MOTOR_1, CW, usSpeed);
  motorGo(MOTOR_2, CCW, usSpeed);
}

void IncreaseSpeed() {
  usSpeed = usSpeed + 10;
  if(usSpeed > 255) {
    usSpeed = 255;  
  }
  
  Serial.print("Speed +: ");
  Serial.println(usSpeed);

  motorGo(MOTOR_1, LAST, usSpeed);
  motorGo(MOTOR_2, LAST, usSpeed);  
}

void DecreaseSpeed() {
  usSpeed = usSpeed - 10;
  if (usSpeed < 0) {
    usSpeed = 0;  
  }
  
  Serial.print("Speed -: ");
  Serial.println(usSpeed);

  motorGo(MOTOR_1, LAST, usSpeed);
  motorGo(MOTOR_2, LAST, usSpeed);  
}

void Distance() {
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  int duration = pulseIn(ECHO_PIN, HIGH);
  int distance = duration / 58;
  if (distance <= 0) {
    Serial.println("Out of range");
  } else {
    Serial.print(distance);
    Serial.println(" cm");
  }
}

void motorGo(uint8_t motor, uint8_t direct, uint8_t pwm) {         // Function that controls the variables: motor(0 ou 1), direction (cw ou ccw) e pwm (entra 0 e 255);
  if(motor == MOTOR_1) {
    if (direct == LAST) {
      direct = lastMotor1Status;
    }
    if (direct == CW) {
      digitalWrite(MOTOR_A1_PIN, LOW);
      digitalWrite(MOTOR_B1_PIN, HIGH);
    } else if (direct == CCW) {
      digitalWrite(MOTOR_A1_PIN, HIGH);
      digitalWrite(MOTOR_B1_PIN, LOW);
    } else {
      digitalWrite(MOTOR_A1_PIN, LOW);
      digitalWrite(MOTOR_B1_PIN, LOW);
    }
    lastMotor1Status = direct;
    
    analogWrite(PWM_MOTOR_1, pwm);
  } else if (motor == MOTOR_2) {
    if (direct == LAST) {
      direct = lastMotor2Status;
    }
    if (direct == CW) {
      digitalWrite(MOTOR_A2_PIN, LOW);
      digitalWrite(MOTOR_B2_PIN, HIGH);
    } else if (direct == CCW) {
      digitalWrite(MOTOR_A2_PIN, HIGH);
      digitalWrite(MOTOR_B2_PIN, LOW);
    } else if (direct == LAST) {
      digitalWrite(MOTOR_A1_PIN, HIGH);
      digitalWrite(MOTOR_B1_PIN, LOW);
    } else {
      digitalWrite(MOTOR_A2_PIN, LOW);
      digitalWrite(MOTOR_B2_PIN, LOW);
    }
    lastMotor2Status = direct;
    
    analogWrite(PWM_MOTOR_2, pwm);
  }
}

