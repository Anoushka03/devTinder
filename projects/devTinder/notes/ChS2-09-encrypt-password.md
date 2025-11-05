## What is salt in bcrypt ?
It is a random hash that is generated with respect to the number of rounds specified in the function call. 
Ex : bcrypt(password, salt)
Salt -  the salt to be used to hash the password. if specified as a number then a salt will be generated with the specified number of rounds and used

when you are hashing your data, the module will go through a series of rounds to give you a secure hash. The value you submit is not just the number of rounds the module will go through to hash your data. The module will use the value you enter and go through 2^rounds hashing iterations.

Resultant hashes will be 60 characters long and they will include the salt among other parameters, as follows:

$[algorithm]$[cost]$[salt][hash]

2 chars hash algorithm identifier prefix. "$2a$" or "$2b$" indicates BCrypt
Cost-factor (n). Represents the exponent used to determine how many iterations 2^n
16-byte (128-bit) salt, base64 encoded to 22 characters
24-byte (192-bit) hash, base64 encoded to 31 characters
