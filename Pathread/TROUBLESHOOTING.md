# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. **Story Generation Error**

**Error**: `generateStory` function fails with call stack error

**Solution**: 
- ✅ **Fixed**: Variable scope issue in `StoryLoadingScreen.tsx`
- ✅ **Fixed**: API key configuration updated
- ✅ **Added**: Better error logging and debugging

**Check**:
1. Open browser console or React Native debugger
2. Look for console logs starting with "OpenAI Service initialized"
3. Verify API key is being loaded correctly

### 2. **API Key Not Working**

**Symptoms**:
- "OpenAI API key not configured" error
- Story generation fails immediately

**Solutions**:
1. **Check API Key Format**:
   ```bash
   # Should start with 'sk-'
   REDACTED
   ```

2. **Verify Configuration**:
   - Check `constants/config.ts` has your API key
   - Or create `.env` file with `EXPO_PUBLIC_OPENAI_API_KEY=your-key`

3. **Restart App**:
   ```bash
   npx expo start --clear
   ```

### 3. **Network/API Errors**

**Symptoms**:
- "OpenAI API error: 401" (Unauthorized)
- "OpenAI API error: 429" (Rate limit)
- Network timeout errors

**Solutions**:
1. **401 Unauthorized**: Check API key is correct and active
2. **429 Rate Limit**: Wait a few minutes, you may have hit rate limits
3. **Network Issues**: Check internet connection

### 4. **Story Reader Not Loading**

**Symptoms**:
- Loading screen shows but never progresses
- App crashes when navigating to story reader

**Solutions**:
1. **Check Console Logs**: Look for error messages
2. **Verify Story Generation**: Make sure story was generated successfully
3. **Check Navigation**: Ensure story-reader route exists

### 5. **TypeScript Errors**

**Symptoms**:
- Build fails with TypeScript errors
- IDE shows red squiggly lines

**Solutions**:
1. **Run Type Check**:
   ```bash
   npx tsc --noEmit
   ```

2. **Check Imports**: Make sure all imports are correct
3. **Restart TypeScript Server**: In VS Code, press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 🔍 Debugging Steps

### 1. **Enable Debug Logging**
The app now includes extensive logging. Check console for:
- `OpenAI Service initialized with API key: sk-proj-vjli6b5...`
- `Starting story generation with params: {...}`
- `Story params prepared: {...}`
- `Making OpenAI API request with model: gpt-4`

### 2. **Test API Key Manually**
You can test your API key by making a simple request:

```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }'
```

### 3. **Check Network Tab**
In browser dev tools, check the Network tab for:
- Failed requests to `api.openai.com`
- Response status codes
- Error messages in response body

## 🚀 Quick Fixes

### **If Story Generation Still Fails**:

1. **Restart Everything**:
   ```bash
   # Stop the current server
   Ctrl+C
   
   # Clear cache and restart
   npx expo start --clear
   ```

2. **Check API Key Balance**:
   - Go to [OpenAI Usage](https://platform.openai.com/usage)
   - Verify you have credits available

3. **Try Different Model**:
   - Change `MODEL: 'gpt-3.5-turbo'` in `config.ts`
   - GPT-3.5 is cheaper and faster

4. **Reduce Token Limit**:
   - Change `MAX_TOKENS: 500` in `config.ts`
   - Smaller responses = faster generation

## 📞 Still Having Issues?

If you're still experiencing problems:

1. **Check the console logs** - they now provide detailed information
2. **Verify your API key** is active and has credits
3. **Try the manual API test** above
4. **Check your internet connection**
5. **Restart the development server** with `--clear` flag

The app now has much better error handling and logging, so you should see exactly what's going wrong in the console! 🎯
