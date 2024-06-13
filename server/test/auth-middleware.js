const authMiddleware = require('../middleware/is-auth')
const expect = require('chai').expect

describe('Auth middleware',function(){

    it('should throw an error if no authorization header is present',function(){
        const req = {
            get:function(){
                return null
            }
        }
        expect(authMiddleware.bind(this,req,{},() => {})).to.throw('Not authenticated')
    })

    it('should throw a error if the authorization header is only one string',function(){
        const req = {
            get: function(headerName){
                return 'xyz'
            }
        }
        expect(authMiddleware.bind(this,req,{},()=>{})).to.throw()
    })

})